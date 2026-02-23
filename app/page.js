'use client';
import { useState, useEffect, useRef } from 'react';

// ── Intersection Observer for scroll animations ──
function useInView() {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target); }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, isInView] = useInView();
  return (
    <div ref={ref} style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    await fetch('https://formspree.io/f/mgolpvyg', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setSubmitted(true);
    setLoading(false);
  };

  const features = [
    { icon: '◐', title: 'Branded Client Portal', desc: 'Your clients get their own login. They see project status, files, invoices, and messages — all in one clean dashboard with your brand on it.', tag: 'No more email chaos' },
    { icon: '✦', title: 'AI Proposal Generator', desc: 'Paste messy client notes. Get a professional proposal with scope, timeline, and pricing in 10 seconds. Review, tweak, send.', tag: 'Save 2+ hours per proposal' },
    { icon: '◈', title: 'Simple Invoicing', desc: 'Create invoices, send them through the portal, track what\'s paid and what\'s overdue. Your client can pay directly with one click.', tag: 'Get paid faster' },
    { icon: '◉', title: 'File Sharing Hub', desc: 'No more digging through email for that logo file from 3 weeks ago. Everything lives in the portal, organized by project.', tag: 'Everything in one place' },
    { icon: '▣', title: 'Project Tracker', desc: 'Your client sees exactly where their project stands. No more \'just checking in\' emails. They check the portal instead.', tag: 'Kill status update emails' },
    { icon: '◎', title: 'Client Approvals', desc: 'Need sign-off on a design? Send it through the portal. Client clicks Approve — you have a timestamped record. Done.', tag: 'No more WhatsApp approvals' },
  ];

  const steps = [
    { num: '01', title: 'Sign up in 60 seconds', desc: 'Create your account, add your brand colors and logo. Your portal is live immediately.' },
    { num: '02', title: 'Add your first client', desc: 'Enter their name and email. They get a branded login link to their personal portal.' },
    { num: '03', title: 'Generate an AI proposal', desc: 'Paste your notes from the client call. AI creates a professional proposal instantly.' },
    { num: '04', title: 'Get paid & deliver', desc: 'Client approves the proposal, you send invoices, share files, and track progress — all in one place.' },
  ];

  const testimonials = [
    { name: 'Alex R.', role: 'Freelance Web Designer', text: 'I was managing 8 clients across Gmail, WhatsApp, Google Drive, and PayPal. Now everything is in one link. My clients think I\'m way more professional than I actually am.', avatar: 'AR' },
    { name: 'Priya K.', role: 'Brand Consultant', text: 'The AI proposal generator alone is worth it. I used to spend Sunday nights writing proposals. Now I paste my notes and it\'s done in seconds.', avatar: 'PK' },
    { name: 'Marcus J.', role: 'Freelance Photographer', text: 'My clients used to email me asking for files I\'d already sent. Now I just say check your portal. It\'s saved me hours every week.', avatar: 'MJ' },
  ];

  const faqs = [
    { q: 'Do my clients need to download an app?', a: 'No. Skopio is a web app. Your client clicks a link, logs in from any browser on any device — phone, tablet, laptop. Nothing to install.' },
    { q: 'How is this different from Dubsado or HoneyBook?', a: 'Those tools are built for established businesses with 50+ features you\'ll never use, starting at $20-40/month and getting expensive fast. Skopio does 5 things perfectly for solo freelancers at a fraction of the price. Plus, none of them have AI-powered proposal generation built in.' },
    { q: 'Is my data secure?', a: 'Yes. Skopio runs on Google Cloud infrastructure (same security as Gmail and Google Drive). All data is encrypted at rest and in transit. Payments are processed through Stripe — we never see or store credit card numbers.' },
    { q: 'Can I try it before paying?', a: 'Absolutely. 14-day free trial, no credit card required. If it doesn\'t save you time, don\'t pay.' },
    { q: 'What if I only have 2-3 clients?', a: 'That\'s exactly who we built this for. Our Starter plan covers up to 5 clients for $19/month. You don\'t need 50 clients to benefit — even one client portal saves you hours of back-and-forth emails.' },
    { q: 'Can I customize the portal with my brand?', a: 'Yes. Add your logo, brand colors, and custom domain. Your clients see YOUR brand, not ours.' },
  ];

  const plans = [
    { name: 'Starter', price: '19', desc: 'For freelancers just getting started', features: ['Up to 5 clients', 'AI proposal generator', 'Invoicing & payments', 'File sharing', 'Project tracker', 'Your brand colors & logo'], popular: false },
    { name: 'Pro', price: '39', desc: 'For established freelancers', features: ['Up to 25 clients', 'Everything in Starter', 'Custom domain portal', 'Client approvals', 'Priority support', 'Advanced AI templates'], popular: true },
    { name: 'Studio', price: '79', desc: 'For small agencies & teams', features: ['Unlimited clients', 'Everything in Pro', 'Team member access', 'White-label portal', 'API access', 'Dedicated onboarding'], popular: false },
  ];

  const EmailForm = ({ id }) => (
    !submitted ? (
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 480, width: '100%' }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e8e4df', fontSize: 15, padding: '14px 18px', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.3s' }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(200,149,108,0.4)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
        <button type="submit" disabled={loading}
          style={{ background: 'linear-gradient(135deg, #c8956c, #a57650)', color: '#08080c', fontWeight: 600, border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Joining...' : 'Get Early Access'}
        </button>
      </form>
    ) : (
      <div style={{ background: 'rgba(200,149,108,0.08)', border: '1px solid rgba(200,149,108,0.2)', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <span style={{ fontSize: 20 }}>✓</span>
        <span style={{ color: '#c8956c', fontWeight: 500 }}>You&apos;re on the list! We&apos;ll notify you when we launch.</span>
      </div>
    )
  );

  const s = { // shared styles
    section: { maxWidth: 1120, margin: '0 auto', padding: '80px 24px' },
    label: { fontSize: 13, fontWeight: 600, color: '#c8956c', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 },
    h2: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, letterSpacing: '-0.02em', color: '#f5f2ee' },
    glow: { height: 1, background: 'linear-gradient(90deg, transparent, #c8956c40, transparent)' },
  };

  return (
    <>
      {/* Grain overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.025, zIndex: 9999,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ═══ NAV ═══ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 24px',
        background: scrolled ? 'rgba(8,8,12,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent', transition: 'all 0.3s' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #c8956c, #a57650)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08080c', fontWeight: 700, fontSize: 14 }}>S</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em' }}>Skopio</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" style={{ color: 'rgba(232,228,223,0.5)', fontSize: 14, fontWeight: 500, transition: 'color 0.3s' }}>Features</a>
            <a href="#pricing" style={{ color: 'rgba(232,228,223,0.5)', fontSize: 14, fontWeight: 500, transition: 'color 0.3s' }}>Pricing</a>
            <a href="#faq" style={{ color: 'rgba(232,228,223,0.5)', fontSize: 14, fontWeight: 500, transition: 'color 0.3s' }}>FAQ</a>
            <a href="#waitlist" style={{ background: 'linear-gradient(135deg, #c8956c, #a57650)', color: '#08080c', fontWeight: 600, padding: '8px 20px', borderRadius: 8, fontSize: 14 }}>Get Early Access</a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', textAlign: 'center', maxWidth: 1120, margin: '0 auto', padding: '140px 24px 80px' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, #c8956c10 0%, transparent 70%)', pointerEvents: 'none' }} />
        <FadeIn>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,149,108,0.08)', border: '1px solid rgba(200,149,108,0.15)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8956c' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#c8956c' }}>Launching March 2026 — Join the waitlist</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 800, margin: '0 auto 24px', color: '#f5f2ee' }}>
            Stop chasing clients<br /><span style={{ color: '#c8956c', fontStyle: 'italic' }}>over email.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.65, color: 'rgba(232,228,223,0.5)', maxWidth: 560, margin: '0 auto 40px' }}>
            Give every client a branded portal where they can see project status, approve proposals, and pay invoices. AI writes your proposals in 10 seconds.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div id="waitlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
            <EmailForm />
            <p style={{ fontSize: 13, color: 'rgba(232,228,223,0.25)', marginTop: 12 }}>Free 14-day trial · No credit card required · Cancel anytime</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div style={{ maxWidth: 880, margin: '0 auto', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />)}
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '4px 16px', fontSize: 12, color: 'rgba(232,228,223,0.3)' }}>portal.skopio.co/sarah-mitchell</div>
              </div>
            </div>
            <div style={{ padding: '32px 32px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: 'rgba(232,228,223,0.3)', marginBottom: 4 }}>Welcome back</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: '#f5f2ee' }}>Hi Sarah 👋</div>
              </div>
              {[
                { label: 'Website Redesign', status: 'In Progress', progress: 65, color: '#c8956c' },
                { label: 'Brand Identity', status: 'In Review', progress: 90, color: '#8b7cf6' },
                { label: 'Invoice #002', status: '$1,500 Pending', progress: 0, color: '#e8b44f' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e4df', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: item.color, fontWeight: 500, marginBottom: item.progress ? 10 : 0 }}>{item.status}</div>
                  {item.progress > 0 && (
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: item.color, borderRadius: 4 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <div style={s.glow} />

      {/* ═══ STATS ═══ */}
      <section style={{ ...s.section, padding: '64px 24px' }}>
        <FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
            {[
              { value: <Counter target={2} suffix="+ hrs" />, label: 'Saved per proposal with AI' },
              { value: <><Counter target={10} /> sec</>, label: 'To generate a professional proposal' },
              { value: <Counter target={83} suffix="%" />, label: 'Of freelancers still use email + chaos' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#c8956c', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: 'rgba(232,228,223,0.4)', marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div style={s.glow} />

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={s.section}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={s.label}>Features</p>
            <h2 style={{ ...s.h2, maxWidth: 550, margin: '0 auto' }}>Everything your freelance business needs. Nothing it doesn&apos;t.</h2>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 32, transition: 'all 0.4s', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 28, color: '#c8956c' }}>{f.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(200,149,108,0.6)', background: 'rgba(200,149,108,0.08)', padding: '4px 10px', borderRadius: 100 }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f5f2ee', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,228,223,0.45)' }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div style={s.glow} />

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={s.section}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={s.label}>How it works</p>
            <h2 style={s.h2}>Up and running in 5 minutes.</h2>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 600, color: 'rgba(200,149,108,0.08)', marginBottom: 8 }}>{step.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f5f2ee', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,228,223,0.4)' }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div style={s.glow} />

      {/* ═══ AI PROPOSAL DEMO ═══ */}
      <section style={s.section}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={s.label}>The Magic</p>
            <h2 style={s.h2}>From messy notes to polished proposal.</h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0, alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(232,228,223,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>You paste this</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(232,228,223,0.5)', fontStyle: 'italic' }}>
                &ldquo;sarah needs a website for her photography business, 5 pages, wants gallery with lightbox, contact form, about page, pricing page, budget is $2500, needs it in 3 weeks, must work on mobile&rdquo;
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, color: '#c8956c' }}>→</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(200,149,108,0.06), rgba(200,149,108,0.01))', border: '1px solid rgba(200,149,108,0.15)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#c8956c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>AI generates this ✦</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(232,228,223,0.65)' }}>
                <strong style={{ color: '#f5f2ee' }}>Photography Portfolio Website</strong><br />
                <span style={{ color: 'rgba(232,228,223,0.4)', fontSize: 13 }}>Prepared for Sarah · 5 pages · 3-week delivery</span><br /><br />
                <span style={{ color: '#c8956c', fontSize: 12, fontWeight: 600 }}>SCOPE</span><br />
                Gallery with lightbox · About · Pricing · Contact form · Mobile-optimized<br /><br />
                <span style={{ color: '#c8956c', fontSize: 12, fontWeight: 600 }}>INVESTMENT</span><br />
                <strong style={{ color: '#f5f2ee', fontSize: 18 }}>$2,500</strong><span style={{ color: 'rgba(232,228,223,0.3)' }}> · 50% upfront</span>
              </div>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'rgba(232,228,223,0.3)' }}>10 seconds. Not 2 hours.</p>
        </FadeIn>
      </section>

      <div style={s.glow} />

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={s.section}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={s.label}>Early Users</p>
            <h2 style={s.h2}>Freelancers are loving it.</h2>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), transparent)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 28 }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(232,228,223,0.55)', marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #c8956c, #a57650)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08080c', fontWeight: 700, fontSize: 12 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e8e4df' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(232,228,223,0.35)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div style={s.glow} />

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={s.section}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={s.label}>Pricing</p>
            <h2 style={s.h2}>Simple pricing. No surprises.</h2>
            <p style={{ fontSize: 15, color: 'rgba(232,228,223,0.4)', marginTop: 12 }}>Pay less than a single client lunch. Get your whole business organized.</p>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto' }}>
          {plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ background: plan.popular ? 'linear-gradient(180deg, rgba(200,149,108,0.06), rgba(200,149,108,0.01))' : 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
                border: `1px solid ${plan.popular ? 'rgba(200,149,108,0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 20, padding: 36, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #c8956c, #a57650)', color: '#08080c', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: '0 0 8px 8px' }}>MOST POPULAR</div>}
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f5f2ee', marginBottom: 4, marginTop: plan.popular ? 12 : 0 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(232,228,223,0.35)', marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 600, color: plan.popular ? '#c8956c' : '#f5f2ee' }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: 'rgba(232,228,223,0.3)' }}>/month</span>
                </div>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ color: '#c8956c', fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'rgba(232,228,223,0.55)' }}>{f}</span>
                  </div>
                ))}
                <a href="#waitlist" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: plan.popular ? 600 : 500,
                  background: plan.popular ? 'linear-gradient(135deg, #c8956c, #a57650)' : 'rgba(255,255,255,0.05)',
                  color: plan.popular ? '#08080c' : '#e8e4df', border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>Join the waitlist</a>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div style={s.glow} />

      {/* ═══ COMPARISON ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={s.h2}>Why freelancers switch to Skopio</h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { label: 'Price', us: 'From $19/mo', them: '$40–$299/mo' },
              { label: 'AI proposals', us: 'Built in ✦', them: 'Not available or $69/mo add-on' },
              { label: 'Setup time', us: '5 minutes', them: 'Hours to configure' },
              { label: 'Features', us: '5 essential tools', them: '50+ bloated features' },
              { label: 'Built for', us: 'Solo freelancers', them: 'Agencies & enterprises' },
              { label: 'Learning curve', us: 'None', them: 'Watch tutorial videos' },
            ].map((row, i, arr) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', padding: '14px 20px', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(232,228,223,0.4)' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#c8956c', textAlign: 'center' }}>{row.us}</span>
                <span style={{ fontSize: 13, color: 'rgba(232,228,223,0.25)', textAlign: 'center' }}>{row.them}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 20px 0' }}>
            <span />
            <span style={{ fontSize: 11, color: 'rgba(200,149,108,0.4)', textAlign: 'center', fontWeight: 600 }}>Skopio</span>
            <span style={{ fontSize: 11, color: 'rgba(232,228,223,0.15)', textAlign: 'center' }}>Others</span>
          </div>
        </FadeIn>
      </section>

      <div style={s.glow} />

      {/* ═══ FAQ ═══ */}
      <section id="faq" style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={s.label}>FAQ</p>
            <h2 style={{ ...s.h2, fontSize: 'clamp(28px, 4vw, 36px)' }}>Questions? Answered.</h2>
          </div>
        </FadeIn>
        {faqs.map((faq, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#e8e4df', paddingRight: 20 }}>{faq.q}</span>
                <span style={{ color: '#c8956c', fontSize: 18, transform: activeFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>+</span>
              </button>
              <div style={{ maxHeight: activeFaq === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(232,228,223,0.45)', paddingBottom: 20 }}>{faq.a}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      <div style={s.glow} />

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ background: 'linear-gradient(135deg, rgba(200,149,108,0.06), rgba(200,149,108,0.02))', border: '1px solid rgba(200,149,108,0.1)', borderRadius: 24, padding: '56px 32px', maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', color: '#f5f2ee', marginBottom: 16 }}>
              Ready to look more professional<br /><span style={{ color: '#c8956c', fontStyle: 'italic' }}>without more work?</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(232,228,223,0.45)', maxWidth: 440, margin: '0 auto 32px' }}>Join the waitlist. Be the first to try Skopio when we launch in March 2026.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EmailForm />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #c8956c, #a57650)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08080c', fontWeight: 700, fontSize: 10 }}>S</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: 'rgba(232,228,223,0.35)' }}>Skopio</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://x.com/skopioapp" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'rgba(232,228,223,0.3)', transition: 'color 0.3s' }}>Twitter</a>
            <a href="https://linkedin.com/company/skopio" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'rgba(232,228,223,0.3)', transition: 'color 0.3s' }}>LinkedIn</a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(232,228,223,0.2)' }}>© 2026 Skopio. Built for freelancers who value simplicity.</p>
        </div>
      </footer>
    </>
  );
}
