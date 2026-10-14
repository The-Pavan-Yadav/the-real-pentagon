import React, { useState } from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import {
  IconCopy,
  IconCheck,
  IconThumbUp,
  IconMessageCircle,
  IconShare,
  IconBulb,
  IconPhoto,
  IconVideo,
  IconFileText,
  IconTrophy,
  IconEdit,
  IconDownload,
  IconPlayerPlay,
} from '@tabler/icons-react';

interface TeacherProfilePageProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

interface TeacherPost {
  id: string;
  type: 'image' | 'video' | 'article' | 'draft';
  author: string;
  role: string;
  time?: string;
  text: string;
  reactions: number;
  comments: number;
  reposts: number;
  impressions: string;
  videoDuration?: string;
}

interface PortfolioItem {
  id: string;
  type: 'publication' | 'workshop' | 'curriculum' | 'award';
  tag: string;
  title: string;
  sub: string;
  desc: string;
  colorClass: string;
}

interface ResourceItem {
  id: string;
  type: 'lesson' | 'worksheet' | 'video' | 'presentation' | 'qbank';
  title: string;
  desc: string;
  count: string;
  actionText: string;
}

export const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'portfolio' | 'resources' | 'endorsements'>('posts');
  const [copied, setCopied] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    name: 'Dr. Ramesh Kumar',
    title: 'Senior Science teacher',
    school: 'Government Higher Secondary School',
    experience: '18 years',
    bio: 'M.Sc. Physics, B.Ed. · Government Higher Secondary School. Physics and science educator focused on practical, low-cost science teaching and mentoring students for state-level science fairs.',
    philosophy: 'Every student can learn science when they are allowed to test it themselves.',
  });

  // Filters
  const [postFilter, setPostFilter] = useState<'all' | 'image' | 'video' | 'article' | 'draft'>('all');
  const [portfolioFilter, setPortfolioFilter] = useState<'all' | 'publication' | 'workshop' | 'curriculum' | 'award'>('all');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'lesson' | 'worksheet' | 'video' | 'presentation' | 'qbank'>('all');

  // Like states
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Posts State
  const [posts, setPosts] = useState<TeacherPost[]>([
    {
      id: 'tp1',
      type: 'image',
      author: 'Dr. Ramesh Kumar',
      role: 'Senior Science teacher · 2h · 🌐',
      text: 'Proud moment: my student Divya won first place at the state science fair with a low-cost water purifier she designed and built herself.',
      reactions: 248,
      comments: 36,
      reposts: 12,
      impressions: '12.8k impressions · 9 interested',
    },
    {
      id: 'tp2',
      type: 'video',
      author: 'Dr. Ramesh Kumar',
      role: 'Senior Science teacher · 3d · 🌐',
      text: 'Teaching resource: a 3-minute demonstration of refraction using only a glass of water and a coin. Free to use in your class.',
      reactions: 412,
      comments: 58,
      reposts: 31,
      impressions: '8.1k impressions · 27 interested',
      videoDuration: '2:48',
    },
  ]);

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 'pf1',
      type: 'publication',
      tag: 'Publication',
      title: 'Low-cost physics labs',
      sub: 'Journal of Science Education · 2025',
      desc: 'Experiments for classrooms with limited equipment.',
      colorClass: 'c1',
    },
    {
      id: 'pf2',
      type: 'workshop',
      tag: 'Workshop',
      title: 'Science labs for teachers',
      sub: '120 teachers · 2026',
      desc: 'A full-day hands-on workshop for district teachers.',
      colorClass: 'c2',
    },
    {
      id: 'pf3',
      type: 'curriculum',
      tag: 'Curriculum',
      title: 'Grade 10 physics unit',
      sub: 'Designed 2024',
      desc: 'Twelve lessons built around practical activities.',
      colorClass: 'c3',
    },
    {
      id: 'pf4',
      type: 'award',
      tag: 'Award',
      title: 'State teaching award',
      sub: 'Shortlisted · 2026',
      desc: 'Recognised for innovation in science teaching.',
      colorClass: 'c4',
    },
  ]);

  // Resources State
  const [resourceItems, setResourceItems] = useState<ResourceItem[]>([
    {
      id: 'res1',
      type: 'lesson',
      title: 'Refraction lesson plan',
      desc: 'Lesson plan · Physics · Grade 10',
      count: '1,240 downloads',
      actionText: 'Download',
    },
    {
      id: 'res2',
      type: 'worksheet',
      title: 'Motion and force worksheet set',
      desc: 'Worksheets · Physics · Grade 9',
      count: '860 downloads',
      actionText: 'Download',
    },
    {
      id: 'res3',
      type: 'video',
      title: 'Optics with a glass of water',
      desc: 'Video · 2:48 · Physics · Grade 10',
      count: '9.6k views',
      actionText: 'Watch',
    },
    {
      id: 'res4',
      type: 'presentation',
      title: 'Energy transformations slides',
      desc: 'Presentation · General science · Grade 8',
      count: '540 downloads',
      actionText: 'Download',
    },
  ]);

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const [uploadResourceOpen, setUploadResourceOpen] = useState(false);
  const [endorseOpen, setEndorseOpen] = useState(false);

  // Form states
  const [newPostText, setNewPostText] = useState('');
  const [newPostType, setNewPostType] = useState<'image' | 'video' | 'article'>('image');

  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortType, setNewPortType] = useState<'publication' | 'workshop' | 'curriculum' | 'award'>('publication');
  const [newPortSub, setNewPortSub] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');

  const [newResTitle, setNewResTitle] = useState('');
  const [newResType, setNewResType] = useState<'lesson' | 'worksheet' | 'video' | 'presentation' | 'qbank'>('lesson');
  const [newResGrade, setNewResGrade] = useState('Grade 10');
  const [newResSubject, setNewResSubject] = useState('Physics');

  const [endName, setEndName] = useState('');
  const [endEmail, setEndEmail] = useState('');
  const [endSkill, setEndSkill] = useState('Physics');

  const handleCopyId = () => {
    navigator.clipboard?.writeText('TCH-26-001208');
    setCopied(true);
    onToast('Profile ID copied: TCH-26-001208');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = !prev[id];
      onToast(next ? 'Liked post' : 'Unliked post');
      return { ...prev, [id]: next };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: TeacherPost = {
      id: 'tp_' + Date.now(),
      type: newPostType,
      author: profile.name,
      role: `${profile.title} · Just now · 🌐`,
      text: newPostText.trim(),
      reactions: 1,
      comments: 0,
      reposts: 0,
      impressions: '1 impression · Just published',
      videoDuration: newPostType === 'video' ? '3:15' : undefined,
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setCreatePostOpen(false);
    onToast('Faculty post published!');
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) return;
    const tagMap = {
      publication: 'Publication',
      workshop: 'Workshop',
      curriculum: 'Curriculum',
      award: 'Award',
    };
    const colorMap = {
      publication: 'c1',
      workshop: 'c2',
      curriculum: 'c3',
      award: 'c4',
    };
    const newItem: PortfolioItem = {
      id: 'pf_' + Date.now(),
      type: newPortType,
      tag: tagMap[newPortType],
      title: newPortTitle.trim(),
      sub: newPortSub.trim() || '2026',
      desc: newPortDesc.trim() || 'New academic initiative',
      colorClass: colorMap[newPortType],
    };
    setPortfolioItems([...portfolioItems, newItem]);
    setNewPortTitle('');
    setNewPortSub('');
    setNewPortDesc('');
    setAddPortfolioOpen(false);
    onToast('Portfolio item added');
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;
    const tagMap = {
      lesson: 'Lesson plan',
      worksheet: 'Worksheets',
      video: 'Video',
      presentation: 'Presentation',
      qbank: 'Question bank',
    };
    const newItem: ResourceItem = {
      id: 'res_' + Date.now(),
      type: newResType,
      title: newResTitle.trim(),
      desc: `${tagMap[newResType]} · ${newResSubject} · ${newResGrade}`,
      count: '1 download',
      actionText: newResType === 'video' ? 'Watch' : 'Download',
    };
    setResourceItems([newItem, ...resourceItems]);
    setNewResTitle('');
    setUploadResourceOpen(false);
    onToast('Resource uploaded and shared with verified teachers');
  };

  const handleRequestEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!endEmail.trim()) return;
    setEndorseOpen(false);
    onToast(`Endorsement request sent to ${endEmail}`);
    setEndName('');
    setEndEmail('');
  };

  // Profile views chart values
  const viewsChart = [28, 42, 34, 58, 40, 62, 66, 70, 56, 78, 72, 84];
  const maxView = Math.max(...viewsChart);

  const filteredPosts = posts.filter((p) => postFilter === 'all' || p.type === postFilter);
  const filteredPortfolio = portfolioItems.filter((p) => portfolioFilter === 'all' || p.type === portfolioFilter);
  const filteredResources = resourceItems.filter((r) => resourceFilter === 'all' || r.type === resourceFilter);

  return (
    <div className="teacher-profile-root" style={{ minHeight: '100vh', position: 'relative' }}>
      <NetworkBg rgb="150,125,90" alpha={0.22} />

      <PortalTopBar
        currentView="teacher"
        role="faculty"
        userName={profile.name}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        {/* PROFILE HEADER CARD */}
        <section className="card profile" id="profile">
          <div className="banner" id="banner">
            <button
              className="btn ghost sm"
              id="editCoverBtn"
              type="button"
              onClick={() => setEditProfileOpen(true)}
            >
              Edit cover
            </button>
          </div>

          <div className="p-body">
            <div className="av-wrap">
              <div className="avatar" id="avatar">
                {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'RK'}
              </div>
            </div>

            <div className="p-info">
              <h1>
                <span>{profile.name}</span>
              </h1>
              <div className="meta">
                Government teacher · Verified &nbsp;·&nbsp; {profile.title} · {profile.experience}
              </div>
              <p className="bio">{profile.bio}</p>
              <div className="id-chip">
                <span>Profile ID</span>
                <strong id="profileIdText">TCH-26-001208</strong>
                <button
                  id="copyIdBtn"
                  aria-label="Copy profile ID"
                  className="copy-btn"
                  type="button"
                  onClick={handleCopyId}
                >
                  {copied ? <IconCheck size={14} color="#16a34a" /> : <IconCopy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-actions">
              <button
                className="btn ghost sm"
                id="editProfileBtn"
                type="button"
                onClick={() => setEditProfileOpen(true)}
              >
                Edit profile
              </button>
              <button
                className="btn sm"
                id="createPostBtn"
                type="button"
                onClick={() => setCreatePostOpen(true)}
              >
                + Create post
              </button>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <small>Shippers</small>
              <strong>1,284</strong>
              <em>312 shipping · +86 this week</em>
            </div>
            <div className="stat">
              <small>Profile views</small>
              <strong>5,420</strong>
              <em>+12% this week</em>
            </div>
            <div className="stat">
              <small>Post impressions</small>
              <strong>48.2k</strong>
              <em>+9% this week</em>
            </div>
            <div className="stat">
              <small>AIR score</small>
              <strong id="airValue">812</strong>
              <em>Gold tier</em>
            </div>
          </div>

          <div className="tabs" role="tablist">
            <button
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            <button
              className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
            <button
              className={`tab ${activeTab === 'endorsements' ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab('endorsements')}
            >
              Endorsements
            </button>
          </div>
        </section>

        {/* TAB: POSTS */}
        {activeTab === 'posts' && (
          <section className="tab-panel active" id="tab-posts">
            <div className="grid-2">
              <div className="col">
                <article className="card">
                  <h2 className="card__title">Education biography</h2>
                  <p className="body-text">{profile.bio}</p>
                </article>

                <article className="card composer">
                  <div className="composer__row">
                    <div className="avatar-sm">RK</div>
                    <button
                      className="composer__input"
                      id="startPostBtn"
                      type="button"
                      onClick={() => setCreatePostOpen(true)}
                    >
                      Start a post
                    </button>
                  </div>
                  <div className="composer__actions">
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setNewPostType('image');
                        setCreatePostOpen(true);
                      }}
                    >
                      <IconPhoto size={16} /> Photo
                    </button>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setNewPostType('video');
                        setCreatePostOpen(true);
                      }}
                    >
                      <IconVideo size={16} /> Video
                    </button>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setNewPostType('article');
                        setCreatePostOpen(true);
                      }}
                    >
                      <IconFileText size={16} /> Document
                    </button>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setNewPostType('image');
                        setCreatePostOpen(true);
                      }}
                    >
                      <IconTrophy size={16} /> Achievement
                    </button>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setNewPostType('article');
                        setCreatePostOpen(true);
                      }}
                    >
                      <IconEdit size={16} /> Write article
                    </button>
                  </div>
                </article>

                <div className="filters" id="postFilters">
                  {(['all', 'image', 'video', 'article', 'draft'] as const).map((f) => (
                    <button
                      key={f}
                      className={`chip ${postFilter === f ? 'active' : ''}`}
                      onClick={() => setPostFilter(f)}
                    >
                      {f === 'all'
                        ? 'All posts'
                        : f === 'image'
                        ? 'Images'
                        : f === 'video'
                        ? 'Videos'
                        : f === 'article'
                        ? 'Articles'
                        : 'Drafts 3'}
                    </button>
                  ))}
                </div>

                {filteredPosts.map((post) => (
                  <article key={post.id} className="card post" data-type={post.type}>
                    <header className="post__head">
                      <div className="avatar-sm">RK</div>
                      <div className="post__who">
                        <strong>
                          {post.author}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" style={{ display: 'inline', marginLeft: '4px' }}>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M8 12.5l2.7 2.7L16 9.5" />
                          </svg>
                        </strong>
                        <span>{post.role}</span>
                      </div>
                      <button className="more-btn" aria-label="More" onClick={() => onToast('Post options')}>
                        •••
                      </button>
                    </header>

                    <p className="post__text">{post.text}</p>

                    {post.type === 'image' && (
                      <div className="media-grid">
                        <div className="media-grid__big">
                          <IconPhoto size={36} color="#587aa8" />
                        </div>
                        <div className="media-grid__side">
                          <div className="media-grid__a">
                            <IconPhoto size={28} color="#243b63" />
                          </div>
                          <div className="media-grid__b">+3</div>
                        </div>
                      </div>
                    )}

                    {post.type === 'video' && (
                      <div
                        className="video-box"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onToast('Playing demonstration video')}
                      >
                        <div className="video-box__play" />
                        <span className="video-box__time">{post.videoDuration || '2:48'}</span>
                        <div className="video-box__bar" />
                      </div>
                    )}

                    <p className="post__counts">
                      {post.reactions + (likedPosts[post.id] ? 1 : 0)} reactions · {post.comments} comments · {post.reposts} reposts
                    </p>

                    <div className="analytics-bar">
                      <span>📊 {post.impressions}</span>
                      <button className="link-strong" type="button" onClick={() => onToast('Post analytics: ' + post.impressions)}>
                        View analytics
                      </button>
                    </div>

                    <footer className="post__actions">
                      <button
                        className={`like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                        type="button"
                        onClick={() => toggleLike(post.id)}
                      >
                        <IconThumbUp size={16} /> {likedPosts[post.id] ? 'Liked' : 'Like'}
                      </button>
                      <button type="button" onClick={() => onToast('Comments thread opened')}>
                        <IconMessageCircle size={16} /> Comment
                      </button>
                      <button type="button" onClick={() => onToast('Post link copied to clipboard')}>
                        <IconShare size={16} /> Share
                      </button>
                      <button type="button" onClick={() => onToast('Marked as interested in collaboration')}>
                        <IconBulb size={16} /> Interested
                      </button>
                    </footer>
                  </article>
                ))}
              </div>

              {/* ASIDE STATS */}
              <aside className="col">
                <article className="card">
                  <div className="card__row">
                    <h2 className="card__title">Profile views</h2>
                    <span className="muted">Last 30 days</span>
                  </div>
                  <div className="bars" id="viewsBars">
                    {viewsChart.map((v, i) => (
                      <i
                        key={i}
                        className={i >= 6 ? 'hi' : ''}
                        style={{ height: `${(v / maxView) * 100}%` }}
                      />
                    ))}
                  </div>
                  <p className="viewed-by">Viewed by 5,420 people</p>
                  <div className="split-bar">
                    <span style={{ width: '57.5%' }} />
                    <span style={{ width: '34.5%' }} />
                    <span style={{ width: '8%' }} />
                  </div>
                  <ul className="kv">
                    <li>
                      <span>Teachers</span>
                      <strong>3,120</strong>
                    </li>
                    <li>
                      <span>Students</span>
                      <strong>1,860</strong>
                    </li>
                    <li>
                      <span>Others</span>
                      <strong>440</strong>
                    </li>
                  </ul>
                </article>

                <article className="card">
                  <h2 className="card__title">AIR score drivers</h2>
                  <div className="driver">
                    <span>Profile views</span>
                    <div className="track">
                      <i style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div className="driver">
                    <span>Post impressions</span>
                    <div className="track">
                      <i style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="driver">
                    <span>Performance</span>
                    <div className="track">
                      <i style={{ width: '78%' }} />
                    </div>
                  </div>
                  <p className="muted">Based on profile views, post impressions and performance.</p>
                </article>

                <article className="card">
                  <div className="card__row">
                    <h2 className="card__title">Profile strength</h2>
                    <strong>86%</strong>
                  </div>
                  <div className="track track--lg">
                    <i style={{ width: '86%' }} />
                  </div>
                  <p className="muted">Add a resource to reach 100%.</p>
                </article>
              </aside>
            </div>
          </section>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <section className="tab-panel active" id="tab-about">
            <div className="grid-2">
              <div className="col">
                <article className="card">
                  <div className="card__row">
                    <h2 className="card__title">Education biography</h2>
                    <button className="link-btn" type="button" onClick={() => setEditProfileOpen(true)}>
                      ✎ Edit
                    </button>
                  </div>
                  <p className="body-text">{profile.bio}</p>
                </article>

                <article className="card">
                  <h2 className="card__title">Experience</h2>
                  <ul className="timeline">
                    <li>
                      <i className="dot dot--dark" />
                      <div>
                        <strong>{profile.title}</strong>
                        <span>{profile.school} · 2014 to present</span>
                      </div>
                    </li>
                    <li>
                      <i className="dot" />
                      <div>
                        <strong>Science teacher</strong>
                        <span>Government High School · 2008 to 2014</span>
                      </div>
                    </li>
                  </ul>
                </article>

                <article className="card">
                  <h2 className="card__title">Education</h2>
                  <div className="edu">
                    <div>
                      <strong>B.Ed.</strong>
                      <span>State University</span>
                    </div>
                    <em>2008</em>
                  </div>
                  <div className="edu">
                    <div>
                      <strong>M.Sc. Physics</strong>
                      <span>State University</span>
                    </div>
                    <em>2006</em>
                  </div>
                </article>
              </div>

              <aside className="col">
                <article className="card">
                  <h2 className="card__title">Teaching details</h2>
                  <p className="label">Subjects</p>
                  <div className="pills">
                    <span>Physics</span>
                    <span>General science</span>
                  </div>
                  <p className="label">Grades</p>
                  <p className="plain">Grades 8 to 12</p>
                  <p className="label">Languages</p>
                  <div className="pills">
                    <span>English</span>
                    <span>Tamil</span>
                    <span>Hindi</span>
                  </div>
                </article>

                <article className="card">
                  <h2 className="card__title">Teaching philosophy</h2>
                  <blockquote className="quote">"{profile.philosophy}"</blockquote>
                </article>

                <article className="card">
                  <h2 className="card__title">Open to</h2>
                  <div className="pills">
                    <span>Mentoring</span>
                    <span>Collaboration</span>
                    <span>Speaking</span>
                    <span>Workshops</span>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}

        {/* TAB: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <section className="tab-panel active" id="tab-portfolio">
            <div className="toolbar">
              <div className="filters" id="portfolioFilters">
                {(['all', 'publication', 'workshop', 'curriculum', 'award'] as const).map((f) => (
                  <button
                    key={f}
                    className={`chip ${portfolioFilter === f ? 'active' : ''}`}
                    onClick={() => setPortfolioFilter(f)}
                  >
                    {f === 'all'
                      ? 'All'
                      : f === 'publication'
                      ? 'Publications'
                      : f === 'workshop'
                      ? 'Workshops'
                      : f === 'curriculum'
                      ? 'Curriculum'
                      : 'Awards'}
                  </button>
                ))}
              </div>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setAddPortfolioOpen(true)}
              >
                + Add item
              </button>
            </div>

            <div className="portfolio-grid">
              {filteredPortfolio.map((p) => (
                <article key={p.id} className="pcard" data-type={p.type}>
                  <div className={`pcard__top ${p.colorClass}`}>
                    {p.type === 'publication' && <IconFileText size={32} color="#243b63" />}
                    {p.type === 'workshop' && <IconBulb size={32} color="#243b63" />}
                    {p.type === 'curriculum' && <IconEdit size={32} color="#243b63" />}
                    {p.type === 'award' && <IconTrophy size={32} color="#fff" />}
                  </div>
                  <div className="pcard__body">
                    <span className="tag">{p.tag}</span>
                    <h3>{p.title}</h3>
                    <p className="sub">{p.sub}</p>
                    <p>{p.desc}</p>
                  </div>
                </article>
              ))}

              <button
                className="pcard pcard--add"
                type="button"
                onClick={() => setAddPortfolioOpen(true)}
              >
                <span>+</span>Add a publication, workshop, project or award
              </button>
            </div>
          </section>
        )}

        {/* TAB: RESOURCES */}
        {activeTab === 'resources' && (
          <section className="tab-panel active" id="tab-resources">
            <div className="toolbar">
              <div className="filters" id="resourceFilters">
                {(['all', 'lesson', 'worksheet', 'video', 'presentation', 'qbank'] as const).map((f) => (
                  <button
                    key={f}
                    className={`chip ${resourceFilter === f ? 'active' : ''}`}
                    onClick={() => setResourceFilter(f)}
                  >
                    {f === 'all'
                      ? 'All'
                      : f === 'lesson'
                      ? 'Lesson plans'
                      : f === 'worksheet'
                      ? 'Worksheets'
                      : f === 'video'
                      ? 'Videos'
                      : f === 'presentation'
                      ? 'Presentations'
                      : 'Question banks'}
                  </button>
                ))}
              </div>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setUploadResourceOpen(true)}
              >
                Upload resource
              </button>
            </div>

            <div className="card list">
              {filteredResources.map((res) => (
                <div key={res.id} className="res" data-type={res.type}>
                  <div className={`res__icon ${res.type === 'video' ? 'res__icon--dark' : ''}`}>
                    {res.type === 'video' ? <IconVideo size={20} /> : <IconFileText size={20} />}
                  </div>
                  <div className="res__info">
                    <strong>{res.title}</strong>
                    <span>{res.desc}</span>
                  </div>
                  <div className="res__count">{res.count}</div>
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => {
                      if (res.type === 'video') {
                        onToast(`Playing video demonstration: ${res.title}`);
                      } else {
                        onToast(`Downloading: ${res.title}`);
                      }
                    }}
                  >
                    {res.type === 'video' ? (
                      <IconPlayerPlay size={14} style={{ marginRight: '4px' }} />
                    ) : (
                      <IconDownload size={14} style={{ marginRight: '4px' }} />
                    )}
                    {res.actionText}
                  </button>
                </div>
              ))}
            </div>

            <p className="muted foot">
              Resources are free for verified teachers to download and use in their classrooms.
            </p>
          </section>
        )}

        {/* TAB: ENDORSEMENTS */}
        {activeTab === 'endorsements' && (
          <section className="tab-panel active" id="tab-endorsements">
            <div className="grid-2">
              <div className="col">
                <article className="card">
                  <div className="card__row">
                    <h2 className="card__title">Skills and endorsements</h2>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => setEndorseOpen(true)}
                    >
                      Request endorsement
                    </button>
                  </div>

                  <div className="skill">
                    <div className="card__row">
                      <strong>Physics</strong>
                      <span className="muted">64 endorsements</span>
                    </div>
                    <div className="track track--lg">
                      <i style={{ width: '92%' }} />
                    </div>
                    <div className="endorsers">
                      <span className="mini">SK</span>
                      <span className="mini mini--b">AN</span>
                      <span className="mini mini--c">LD</span>
                      <em>Endorsed by 3 teachers you know</em>
                    </div>
                  </div>

                  <div className="skill">
                    <div className="card__row">
                      <strong>Experiment design</strong>
                      <span className="muted">41</span>
                    </div>
                    <div className="track track--lg">
                      <i style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div className="skill">
                    <div className="card__row">
                      <strong>Student mentoring</strong>
                      <span className="muted">37</span>
                    </div>
                    <div className="track track--lg">
                      <i style={{ width: '55%' }} />
                    </div>
                  </div>

                  <div className="skill">
                    <div className="card__row">
                      <strong>Curriculum design</strong>
                      <span className="muted">22</span>
                    </div>
                    <div className="track track--lg">
                      <i style={{ width: '34%' }} />
                    </div>
                  </div>
                </article>
              </div>

              <aside className="col">
                <article className="card">
                  <h2 className="card__title">Recommendations</h2>
                  <blockquote className="quote">
                    "Ramesh makes physics click for every student. His low-cost experiments are now used
                    across our district."
                  </blockquote>
                  <div className="rec">
                    <span className="avatar-sm">SN</span>
                    <div>
                      <strong>Savitha Nair ✔</strong>
                      <span>Headmistress, Government school</span>
                    </div>
                  </div>
                  <hr />
                  <blockquote className="quote">
                    "A generous mentor who shares every resource he builds."
                  </blockquote>
                  <div className="rec">
                    <span className="avatar-sm avatar-sm--b">JT</span>
                    <div>
                      <strong>John Thomas ✔</strong>
                      <span>Chemistry teacher, Private school</span>
                    </div>
                  </div>
                </article>

                <article className="card">
                  <h2 className="card__title">Endorsed by</h2>
                  <ul className="kv">
                    <li>
                      <span>Teachers</span>
                      <strong>118</strong>
                    </li>
                    <li>
                      <span>School leaders</span>
                      <strong>14</strong>
                    </li>
                    <li>
                      <span>Students</span>
                      <strong>32</strong>
                    </li>
                  </ul>
                </article>
              </aside>
            </div>
          </section>
        )}
      </main>

      {/* CREATE POST MODAL */}
      {createPostOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleCreatePost}>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Start a faculty post</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Share updates, classroom wins, demonstrations, or educational documents.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Post Type
                <select
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', background: '#fff' }}
                >
                  <option value="image">Photo / Achievement</option>
                  <option value="video">Video Demonstration</option>
                  <option value="article">Pedagogical Article</option>
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                What do you want to share? *
                <textarea
                  required
                  rows={4}
                  placeholder="Share your teaching experience, experiment findings, or student achievements..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setCreatePostOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditProfileOpen(false);
                onToast('Faculty profile updated successfully');
              }}
            >
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Edit Teacher Profile</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Update your public profile details and teaching bio.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Full Name
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Title & Position
                <input
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Institution
                <input
                  value={profile.school}
                  onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                Education Biography
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PORTFOLIO ITEM MODAL */}
      {addPortfolioOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleAddPortfolio}>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Add Portfolio Item</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Showcase a publication, workshop, curriculum project, or award.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Category
                <select
                  value={newPortType}
                  onChange={(e) => setNewPortType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', background: '#fff' }}
                >
                  <option value="publication">Publication</option>
                  <option value="workshop">Workshop</option>
                  <option value="curriculum">Curriculum</option>
                  <option value="award">Award</option>
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Title *
                <input
                  required
                  placeholder="e.g. Practical Physics Manual"
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Subtitle / Venue
                <input
                  placeholder="e.g. State Science Directorate · 2026"
                  value={newPortSub}
                  onChange={(e) => setNewPortSub(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                Short Description
                <textarea
                  rows={2}
                  placeholder="Summary of objectives and results"
                  value={newPortDesc}
                  onChange={(e) => setNewPortDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setAddPortfolioOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD RESOURCE MODAL */}
      {uploadResourceOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleUploadResource}>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Upload Educational Resource</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Share worksheets, lesson plans, videos, or presentations with colleagues.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Resource Type
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', background: '#fff' }}
                >
                  <option value="lesson">Lesson Plan</option>
                  <option value="worksheet">Worksheet Set</option>
                  <option value="video">Demonstration Video</option>
                  <option value="presentation">Slide Deck</option>
                  <option value="qbank">Question Bank</option>
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Title *
                <input
                  required
                  placeholder="e.g. Thermodynamics and Heat Transfer"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>
                  Subject
                  <input
                    value={newResSubject}
                    onChange={(e) => setNewResSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </label>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>
                  Grade Level
                  <input
                    value={newResGrade}
                    onChange={(e) => setNewResGrade(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </label>
              </div>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setUploadResourceOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST ENDORSEMENT MODAL */}
      {endorseOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleRequestEndorsement}>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Request Endorsement</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Invite a colleague, headmaster or peer educator to endorse your teaching credentials.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Colleague's Name
                <input
                  required
                  placeholder="e.g. Dr. Savitha Nair"
                  value={endName}
                  onChange={(e) => setEndName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Work Email *
                <input
                  type="email"
                  required
                  placeholder="colleague@institution.edu"
                  value={endEmail}
                  onChange={(e) => setEndEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                Skill to Endorse
                <select
                  value={endSkill}
                  onChange={(e) => setEndSkill(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', background: '#fff' }}
                >
                  <option value="Physics">Physics</option>
                  <option value="Experiment design">Experiment design</option>
                  <option value="Student mentoring">Student mentoring</option>
                  <option value="Curriculum design">Curriculum design</option>
                </select>
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setEndorseOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
