import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { PublishedSite, SiteElement } from '../types';
import { publishStorage } from '../utils/publishStorage';

function flattenEls(els: SiteElement[]): SiteElement[] {
  const result: SiteElement[] = [];
  for (const el of els) {
    result.push(el);
    if (el.children?.length) result.push(...flattenEls(el.children));
  }
  return result;
}

function StaticElement({ el, zIndex }: { el: SiteElement; zIndex: number }) {
  const s = el.style;
  const base: CSSProperties = { position: 'absolute', left: s.x, top: s.y, width: s.width, height: s.height, zIndex };
  const typo: CSSProperties = { fontSize: s.fontSize, color: s.color, fontWeight: s.fontWeight, textAlign: s.textAlign, opacity: s.opacity };
  const box: CSSProperties = { backgroundColor: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding };

  switch (el.type) {
    case 'section':
      return <div style={{ ...base, backgroundColor: s.backgroundColor, padding: s.padding }} />;
    case 'heading':
      return <h2 style={{ ...base, ...typo, ...box, margin: 0, lineHeight: 1.2, overflow: 'hidden', wordBreak: 'break-word' }}>{el.content}</h2>;
    case 'text':
      return <p style={{ ...base, ...typo, ...box, margin: 0, lineHeight: 1.6, overflow: 'hidden', wordBreak: 'break-word' }}>{el.content}</p>;
    case 'button':
      return (
        <a
          href={el.href || '#'}
          style={{ ...base, ...typo, ...box, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', cursor: 'pointer' }}
          onClick={(e) => { if (!el.href || el.href === '#') e.preventDefault(); }}
        >
          {el.content}
        </a>
      );
    case 'image':
      return <img src={el.src || 'https://placehold.co/300x200/e2e8f0/94a3b8?text=Image'} alt={el.alt ?? ''} style={{ ...base, objectFit: 'cover' }} />;
    case 'card':
      return (
        <div style={{ ...base, ...box, overflow: 'hidden' }}>
          <div style={{ fontWeight: s.fontWeight ?? '600', fontSize: s.fontSize ?? 16, color: s.color ?? '#111827', lineHeight: 1.3 }}>{el.content}</div>
          {el.subtitle && <div style={{ fontSize: Math.max(12, (s.fontSize ?? 16) - 3), color: '#6b7280', marginTop: 8, lineHeight: 1.5 }}>{el.subtitle}</div>}
        </div>
      );
    case 'divider':
      return <hr style={{ ...base, border: 'none', borderTop: `2px solid ${s.color ?? '#e5e7eb'}` }} />;
    default:
      return <div style={{ ...base, ...typo, ...box }}>{el.content}</div>;
  }
}

function SiteRenderer({ site }: { site: PublishedSite }) {
  const flat = flattenEls(site.elements);
  const totalH = flat.length ? Math.max(1080, ...flat.map((el) => el.style.y + el.style.height + 40)) : 1080;

  useEffect(() => {
    const PAGE_W = 1000;
    const page = document.getElementById('pub-page');
    const wrapper = document.getElementById('pub-wrapper');
    if (!page || !wrapper) return;
    function applyScale() {
      const vw = window.innerWidth;
      if (vw < PAGE_W) {
        const scale = vw / PAGE_W;
        page!.style.transform = `scale(${scale})`;
        page!.style.transformOrigin = 'top left';
        wrapper!.style.height = `${page!.offsetHeight * scale}px`;
        wrapper!.style.overflow = 'hidden';
        wrapper!.style.justifyContent = 'flex-start';
      } else {
        page!.style.transform = '';
        page!.style.transformOrigin = '';
        wrapper!.style.height = '';
        wrapper!.style.overflow = '';
        wrapper!.style.justifyContent = 'center';
      }
    }
    applyScale();
    window.addEventListener('resize', applyScale);
    return () => window.removeEventListener('resize', applyScale);
  }, []);

  return (
    <div
      id="pub-wrapper"
      style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <div
        id="pub-page"
        style={{ position: 'relative', width: 1000, minHeight: totalH, background: '#ffffff', boxShadow: '0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0 }}
      >
        {flat.map((el, idx) => <StaticElement key={el.id} el={el} zIndex={idx + 1} />)}
      </div>
    </div>
  );
}

type PageState = 'loading' | 'loaded' | 'notFound' | 'error';

const CENTER: CSSProperties = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' };

export function PublishedPage({ siteId }: { siteId: string }) {
  const [state, setState] = useState<PageState>('loading');
  const [site, setSite] = useState<PublishedSite | null>(null);

  useEffect(() => {
    publishStorage
      .get(siteId)
      .then((s) => {
        if (s) { setSite(s); setState('loaded'); }
        else setState('notFound');
      })
      .catch(() => setState('error'));
  }, [siteId]);

  if (state === 'loading') {
    return (
      <div style={CENTER}>
        <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>사이트를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={CENTER}>
        <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 500 }}>사이트를 불러오는 중 문제가 발생했습니다</p>
        <a href="/" style={{ marginTop: 16, fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>← Paletto 편집기로</a>
      </div>
    );
  }

  if (state === 'notFound') {
    return (
      <div style={CENTER}>
        <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p style={{ color: '#334155', fontSize: 14, fontWeight: 500 }}>공개 사이트를 찾을 수 없습니다</p>
        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>ID: {siteId}</p>
        <a href="/" style={{ marginTop: 20, fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>← Paletto 편집기로</a>
      </div>
    );
  }

  return <SiteRenderer site={site!} />;
}
