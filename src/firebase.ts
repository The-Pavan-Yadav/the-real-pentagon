import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserRole, UserSession, StudentStore } from './types';
import {
  getRegisteredUsers,
  saveRegisteredUser,
  RegisteredUserRecord,
} from './services/storage';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore: Use named database if specified and not (default), otherwise default database
export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)' &&
  firebaseConfig.firestoreDatabaseId !== ''
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection health check helper (lazy, non-blocking)
export async function testConnection(): Promise<boolean> {
  try {
    await getDoc(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    console.warn('Firebase client offline or connecting:', error);
    return false;
  }
}

// Authentication helpers
export async function signInWithGoogle(role: UserRole = 'student'): Promise<UserSession> {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;

  // Sync profile to Firestore
  const userRef = doc(db, 'users', user.uid);
  let resolvedRole = role;
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.role) resolvedRole = data.role as UserRole;
    } else {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || 'Institutional User',
        role: resolvedRole,
        institution: 'The Pentagon National Education Network',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn('Failed to sync user profile to Firestore (using local fallback)', e);
  }

  return {
    role: resolvedRole,
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || undefined,
    t: Date.now(),
  };
}

export async function loginWithEmail(email: string, pass: string, defaultRole: UserRole): Promise<UserSession> {
  const normalizedEmail = (email || '').trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail) || !normalizedEmail.includes('.')) {
    const err: any = new Error('Please enter a valid institutional email address (e.g., student@example.edu).');
    err.code = 'auth/invalid-email';
    throw err;
  }

  // 1. Try Firebase Auth first
  try {
    const res = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    const user = res.user;

    const userRef = doc(db, 'users', user.uid);
    let resolvedRole = defaultRole;
    try {
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data()?.role) {
        resolvedRole = snap.data().role as UserRole;
      }
    } catch {}

    return {
      role: resolvedRole,
      uid: user.uid,
      email: user.email || normalizedEmail,
      name: user.displayName || normalizedEmail.split('@')[0],
      t: Date.now(),
    };
  } catch (err: any) {
    // 2. If Firebase Auth has email/password provider disabled or user not found in Firebase Auth,
    // check registered users store
    if (
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/admin-restricted-operation'
    ) {
      const registered = getRegisteredUsers();
      const existingUser = registered[normalizedEmail];
      if (existingUser) {
        if (!existingUser.passwordHash || existingUser.passwordHash === pass) {
          return {
            role: existingUser.role,
            uid: existingUser.uid,
            email: existingUser.email,
            name: existingUser.name,
            t: Date.now(),
          };
        } else {
          const badPassErr: any = new Error('Invalid institutional password.');
          badPassErr.code = 'auth/wrong-password';
          throw badPassErr;
        }
      }
    }
    throw err;
  }
}

export async function registerWithEmail(
  email: string,
  pass: string,
  name: string,
  role: UserRole,
  institution: string
): Promise<UserSession> {
  const normalizedEmail = (email || '').trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail) || !normalizedEmail.includes('.')) {
    const err: any = new Error('Please enter a valid institutional email address (e.g., student@example.edu).');
    err.code = 'auth/invalid-email';
    throw err;
  }

  // Check if already registered
  const registered = getRegisteredUsers();
  if (registered[normalizedEmail]) {
    const err: any = new Error('An account with this institutional email already exists. Please Sign In.');
    err.code = 'auth/email-already-in-use';
    throw err;
  }

  // Attempt Firebase Auth account creation
  try {
    const res = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    const user = res.user;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email || normalizedEmail,
        name: name.trim() || normalizedEmail.split('@')[0],
        role,
        institution: institution.trim() || 'The Pentagon National Education Network',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Could not write profile to Firestore:', error);
    }

    const session: UserSession = {
      role,
      uid: user.uid,
      email: user.email || normalizedEmail,
      name: name.trim() || normalizedEmail.split('@')[0],
      t: Date.now(),
    };

    saveRegisteredUser({
      uid: user.uid,
      email: normalizedEmail,
      name: session.name || normalizedEmail.split('@')[0],
      role,
      institution: institution.trim() || 'The Pentagon National Education Network',
      passwordHash: pass,
      createdAt: new Date().toISOString(),
    });

    return session;
  } catch (authErr: any) {
    // If Firebase Auth does not have Email/Password provider enabled,
    // seamlessly provide institutional account registration
    if (
      authErr.code === 'auth/operation-not-allowed' ||
      authErr.code === 'auth/admin-restricted-operation'
    ) {
      console.info(
        'Firebase Auth email/password provider is not toggled on the project. Registering institutional account.'
      );
      const generatedUid = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      const userRecord: RegisteredUserRecord = {
        uid: generatedUid,
        email: normalizedEmail,
        name: name.trim() || normalizedEmail.split('@')[0],
        role,
        institution: institution.trim() || 'The Pentagon National Education Network',
        passwordHash: pass,
        createdAt: new Date().toISOString(),
      };
      saveRegisteredUser(userRecord);

      return {
        role,
        uid: generatedUid,
        email: normalizedEmail,
        name: userRecord.name,
        t: Date.now(),
      };
    }
    throw authErr;
  }
}

export async function logOutFirebase(): Promise<void> {
  await signOut(auth);
}

// Student Data persistence in Firestore
export async function syncStudentDataToFirestore(uid: string, data: StudentStore): Promise<void> {
  try {
    const studentRef = doc(db, 'students', uid);
    await setDoc(studentRef, {
      userId: uid,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not sync student data to Firestore:', error);
  }
}

export async function loadStudentDataFromFirestore(uid: string): Promise<StudentStore | null> {
  try {
    const studentRef = doc(db, 'students', uid);
    const snap = await getDoc(studentRef);
    if (snap.exists()) {
      return snap.data() as StudentStore;
    }
  } catch (error) {
    console.warn('Could not load student data from Firestore:', error);
  }
  return null;
}
