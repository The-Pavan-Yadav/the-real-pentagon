import React, { useState } from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import { PostItem, PostType, StudentStore } from '../types';
import { saveStudentData } from '../services/storage';

interface CreatePostPageProps {
  data: StudentStore;
  onUpdateData: (newData: StudentStore) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
  data,
  onUpdateData,
  onNavigate,
  onLogout,
  onToast,
}) => {
  const TYPES: [PostType, string][] = [
    ['project', 'Project'],
    ['achievement', 'Achievement'],
    ['article', 'Article'],
    ['image', 'Image'],
    ['video', 'Video'],
    ['link', 'Website'],
    ['code', 'Code'],
    ['doc', 'Document'],
    ['slides', 'Presentation'],
    ['design', 'Design'],
    ['audio', 'Audio'],
    ['research', 'Research'],
    ['event', 'Event'],
    ['cert', 'Certificate'],
    ['other', 'Other'],
  ];

  const [type, setType] = useState<PostType>((data.draft?.type as PostType) || 'project');
  const [category, setCategory] = useState<'academic' | 'eca'>((data.draft?.category as any) || 'academic');
  const [result, setResult] = useState<'none' | 'won' | 'participated'>((data.draft?.result as any) || 'none');
  const [visibility, setVisibility] = useState<'everyone' | 'class' | 'me'>((data.draft?.visibility as any) || 'everyone');

  const [title, setTitle] = useState(data.draft?.title || '');
  const [desc, setDesc] = useState(data.draft?.desc || '');
  const [link, setLink] = useState(data.draft?.link || '');
  const [date, setDate] = useState(data.draft?.date || new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState(data.draft?.tags?.join(', ') || '');
  const [img, setImg] = useState<string>(data.draft?.img || '');
  const [err, setErr] = useState('');

  const typeName = TYPES.find((t) => t[0] === type)?.[1] || 'Post';
  const isProject = type === 'project' && category === 'academic';
  const isWon = result === 'won';

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgObj = new Image();
      imgObj.onload = () => {
        const c = document.createElement('canvas');
        c.width = 900;
        c.height = 560;
        const s = Math.max(900 / imgObj.width, 560 / imgObj.height);
        const iw = 900 / s;
        const ih = 560 / s;
        c.getContext('2d')?.drawImage(
          imgObj,
          (imgObj.width - iw) / 2,
          (imgObj.height - ih) / 2,
          iw,
          ih,
          0,
          0,
          900,
          560
        );
        setImg(c.toDataURL('image/jpeg', 0.8));
      };
      imgObj.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDraft = () => {
    const draft: Partial<PostItem> = {
      type,
      category,
      result,
      visibility,
      title,
      desc,
      link,
      date,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      img,
    };
    const updated = { ...data, draft };
    onUpdateData(updated);
    saveStudentData(updated);
    onToast('Draft saved successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (!title.trim() || !desc.trim()) {
      setErr('Please fill in title and description.');
      return;
    }

    if (type === 'image' && !img) {
      setErr('Please add a cover image for an image post.');
      return;
    }

    if (['video', 'link', 'code'].includes(type) && !link) {
      setErr('Please provide a valid link for this type of post.');
      return;
    }

    const newPost: PostItem = {
      id: 'post_' + Date.now(),
      created: Date.now(),
      type,
      category,
      result,
      visibility,
      title: title.trim(),
      desc: desc.trim(),
      link: link.trim() || undefined,
      img: img || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 6),
      date: date || new Date().toISOString().split('T')[0],
    };

    const newEvents = [
      { d: new Date().toISOString().split('T')[0], t: `Posted: ${newPost.title}` },
      ...data.events,
    ];

    const updated: StudentStore = {
      ...data,
      posts: [newPost, ...data.posts],
      draft: null,
      events: newEvents,
    };

    onUpdateData(updated);
    saveStudentData(updated);
    onToast('Post published successfully!');
    setTimeout(() => {
      onNavigate('student-dashboard');
    }, 400);
  };

  return (
    <div className="student-post-root" style={{ minHeight: '100vh', position: 'relative' }}>
      <NetworkBg rgb="150,125,90" alpha={0.22} />

      <PortalTopBar
        currentView="post"
        role="student"
        userName={data.profile?.name}
        avatarUrl={data.profile?.avatar}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        <div className="pgtop">
          <div>
            <a
              className="back"
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('student-dashboard');
              }}
            >
              ← Back to profile
            </a>
            <h1>Create a post</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn ghost" type="button" onClick={handleSaveDraft}>
              Save draft
            </button>
            <button className="btn" type="submit" form="f-post">
              Publish
            </button>
          </div>
        </div>

        <div className="postgrid">
          <form className="card" id="f-post" onSubmit={handleSubmit} noValidate>
            <h3 className="sub">1. What are you posting?</h3>
            <div id="types" className="chip-row">
              {TYPES.map(([tKey, tLabel]) => (
                <button
                  key={tKey}
                  type="button"
                  className={`k ${type === tKey ? 'on' : ''}`}
                  onClick={() => setType(tKey)}
                >
                  {tLabel}
                </button>
              ))}
            </div>

            <h3 className="sub" style={{ marginTop: '16px' }}>
              2. Details
            </h3>

            <label className="req">
              Title *
              <input
                name="title"
                required
                maxLength={90}
                placeholder="Title of your project, achievement or article"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="req">
              Description *
              <textarea
                name="desc"
                required
                maxLength={1200}
                rows={4}
                placeholder="What is it? What did you build, do or learn?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>

            <div className="grid2">
              <div>
                <span className="lab" style={{ marginTop: 0, display: 'block', marginBottom: '6px' }}>
                  Category
                </span>
                <div id="cat" className="chip-row">
                  <button
                    type="button"
                    className={`k ${category === 'academic' ? 'on' : ''}`}
                    onClick={() => setCategory('academic')}
                  >
                    Academic
                  </button>
                  <button
                    type="button"
                    className={`k ${category === 'eca' ? 'on' : ''}`}
                    onClick={() => setCategory('eca')}
                  >
                    Extra-curricular
                  </button>
                </div>
              </div>

              <div>
                <span className="lab" style={{ marginTop: 0, display: 'block', marginBottom: '6px' }}>
                  Result
                </span>
                <div id="res" className="chip-row">
                  <button
                    type="button"
                    className={`k ${result === 'none' ? 'on' : ''}`}
                    onClick={() => setResult('none')}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    className={`k ${result === 'won' ? 'on' : ''}`}
                    onClick={() => setResult('won')}
                  >
                    Won
                  </button>
                  <button
                    type="button"
                    className={`k ${result === 'participated' ? 'on' : ''}`}
                    onClick={() => setResult('participated')}
                  >
                    Participated
                  </button>
                </div>
              </div>
            </div>

            <span className="lab" style={{ display: 'block', marginTop: '14px', marginBottom: '6px' }}>
              Cover image
            </span>
            <label className="drop" id="drop" style={{ cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: 'none' }} />
              <span id="drop-t">
                {img ? 'Image added. Click to change.' : 'Drop an image here or browse'}
              </span>
            </label>
            <p className="muted sm" style={{ marginTop: '6px' }}>
              For PDFs, videos and slides, upload them to Google Drive or YouTube and paste the link below.
            </p>

            <div className="grid2" style={{ marginTop: '12px' }}>
              <label>
                Link (optional)
                <input
                  name="link"
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </label>

              <label>
                Date
                <input
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>

            <label>
              Tags (comma separated)
              <input
                name="tags"
                placeholder="robotics, arduino, team project"
                maxLength={100}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>

            <span className="lab" style={{ marginTop: '10px', display: 'block', marginBottom: '6px' }}>
              Who can see this?
            </span>
            <div id="vis" className="chip-row">
              <button
                type="button"
                className={`k ${visibility === 'everyone' ? 'on' : ''}`}
                onClick={() => setVisibility('everyone')}
              >
                Everyone
              </button>
              <button
                type="button"
                className={`k ${visibility === 'class' ? 'on' : ''}`}
                onClick={() => setVisibility('class')}
              >
                My class
              </button>
              <button
                type="button"
                className={`k ${visibility === 'me' ? 'on' : ''}`}
                onClick={() => setVisibility('me')}
              >
                Only me
              </button>
            </div>

            {err && (
              <p className="sm" id="err" style={{ color: 'var(--bad)', marginTop: '10px' }}>
                {err}
              </p>
            )}
          </form>

          {/* ASIDE PREVIEW */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="card">
              <h3 className="sub">Live preview</h3>
              <div className="pv">
                <div
                  className="cv"
                  id="pv-cv"
                  style={{
                    backgroundImage: img ? `url("${img}")` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!img && 'NO IMAGE'}
                </div>
                <div className="bd">
                  <span className={`badge ${isWon ? 'won' : ''}`} id="pv-badge">
                    {typeName} {isWon ? '· Won' : ''}
                  </span>
                  <h4 id="pv-title">{title || 'Your title'}</h4>
                  <p id="pv-desc">{desc || 'Your description appears here.'}</p>
                  <p id="pv-date" style={{ fontSize: '12px', color: '#64748b' }}>
                    {date}
                  </p>
                </div>
              </div>
            </div>

            <div className="card where">
              <h3 className="sub">Where it will appear</h3>
              <p>
                <span className="yes">✓</span> All posts
              </p>
              <p>
                <span className={isProject ? 'yes' : 'no'}>{isProject ? '✓' : '–'}</span> Projects (academic
                projects only)
              </p>
              <p>
                <span className={isWon ? 'yes' : 'no'}>{isWon ? '✓' : '–'}</span> Achievements (only when the
                result is Won)
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
