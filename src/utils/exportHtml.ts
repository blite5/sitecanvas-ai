import type { SiteElement } from '../types';
import { escapeHtml, escapeAttr } from './escapeHtml';

// ── Flatten in depth-first order (mirrors Canvas render order / z-index) ─────
function flattenForExport(elements: SiteElement[]): SiteElement[] {
  const result: SiteElement[] = [];
  for (const el of elements) {
    result.push(el);
    if (el.children?.length) result.push(...flattenForExport(el.children));
  }
  return result;
}

// ── Style builders ────────────────────────────────────────────────────────────
function createPositionStyle(el: SiteElement): string {
  const s = el.style;
  return `position:absolute;left:${s.x}px;top:${s.y}px;width:${s.width}px;height:${s.height}px`;
}

function createTypographyStyle(el: SiteElement): string {
  const s = el.style;
  const parts: string[] = [];
  if (s.fontSize) parts.push(`font-size:${s.fontSize}px`);
  if (s.color) parts.push(`color:${s.color}`);
  if (s.fontWeight) parts.push(`font-weight:${s.fontWeight}`);
  if (s.textAlign) parts.push(`text-align:${s.textAlign}`);
  return parts.join(';');
}

function createBaseStyle(el: SiteElement): string {
  const s = el.style;
  const parts = [createPositionStyle(el), createTypographyStyle(el)];
  if (s.backgroundColor && s.backgroundColor !== 'transparent') {
    parts.push(`background-color:${s.backgroundColor}`);
  }
  if (s.borderRadius) parts.push(`border-radius:${s.borderRadius}px`);
  if (s.padding) parts.push(`padding:${s.padding}px`);
  if (s.opacity !== undefined && s.opacity !== 1) parts.push(`opacity:${s.opacity}`);
  return parts.filter(Boolean).join(';');
}

// ── Element renderers ─────────────────────────────────────────────────────────
function renderSectionElement(el: SiteElement): string {
  const s = el.style;
  const parts = [createPositionStyle(el)];
  if (s.backgroundColor && s.backgroundColor !== 'transparent') {
    parts.push(`background-color:${s.backgroundColor}`);
  }
  if (s.padding) parts.push(`padding:${s.padding}px`);
  return `<div class="el-section" style="${parts.filter(Boolean).join(';')}"></div>`;
}

function renderHeadingElement(el: SiteElement): string {
  const style = `${createBaseStyle(el)};line-height:1.2;overflow:hidden;word-break:break-word;`;
  return `<h2 class="el-heading" style="${style}">${escapeHtml(el.content)}</h2>`;
}

function renderTextElement(el: SiteElement): string {
  const style = `${createBaseStyle(el)};line-height:1.6;overflow:hidden;word-break:break-word;`;
  return `<p class="el-text" style="${style}">${escapeHtml(el.content)}</p>`;
}

function renderButtonElement(el: SiteElement): string {
  const href = el.href ? escapeAttr(el.href) : '#';
  const style = `${createBaseStyle(el)};display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;user-select:none;`;
  return `<a class="el-button" href="${href}" style="${style}">${escapeHtml(el.content)}</a>`;
}

function renderImageElement(el: SiteElement): string {
  const src = el.src
    ? escapeAttr(el.src)
    : 'https://placehold.co/300x200/e2e8f0/94a3b8?text=Image';
  const alt = el.alt ? escapeAttr(el.alt) : '';
  const style = `${createBaseStyle(el)};object-fit:cover;`;
  return `<img class="el-image" src="${src}" alt="${alt}" style="${style}" />`;
}

function renderCardElement(el: SiteElement): string {
  const s = el.style;
  const titleStyle = [
    `font-weight:${s.fontWeight ?? '600'}`,
    `font-size:${s.fontSize ?? 16}px`,
    `color:${s.color ?? '#111827'}`,
    'line-height:1.3',
  ].join(';');
  const subtitleStyle = [
    `font-size:${Math.max(12, (s.fontSize ?? 16) - 3)}px`,
    'color:#6b7280',
    'margin-top:8px',
    'font-weight:400',
    'line-height:1.5',
  ].join(';');
  return `<div class="el-card" style="${createBaseStyle(el)};overflow:hidden;">
  <div style="${titleStyle}">${escapeHtml(el.content)}</div>${el.subtitle ? `\n  <div style="${subtitleStyle}">${escapeHtml(el.subtitle)}</div>` : ''}
</div>`;
}

function renderDividerElement(el: SiteElement): string {
  const s = el.style;
  const style = `${createPositionStyle(el)};border:none;border-top:2px solid ${s.color ?? '#e5e7eb'};`;
  return `<hr class="el-divider" style="${style}" />`;
}

function renderElement(el: SiteElement): string {
  switch (el.type) {
    case 'section': return renderSectionElement(el);
    case 'heading': return renderHeadingElement(el);
    case 'text':    return renderTextElement(el);
    case 'button':  return renderButtonElement(el);
    case 'image':   return renderImageElement(el);
    case 'card':    return renderCardElement(el);
    case 'divider': return renderDividerElement(el);
    default:
      return `<div style="${createBaseStyle(el)}">${escapeHtml((el as SiteElement).content)}</div>`;
  }
}

// ── Main export function ──────────────────────────────────────────────────────
export function exportToHtml(elements: SiteElement[], siteName: string): string {
  const flat = flattenForExport(elements);

  const totalHeight = Math.max(
    1080,
    ...flat.map((el) => el.style.y + el.style.height + 40),
  );

  const bodyHtml = flat.map(renderElement).join('\n');
  const safeTitle = escapeHtml(siteName);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      min-height: 100vh;
    }
    .page-scale-wrapper {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .page {
      position: relative;
      width: 1000px;
      min-height: ${totalHeight}px;
      background: #ffffff;
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      flex-shrink: 0;
      transform-origin: top left;
    }
    .el-button:hover { filter: brightness(0.92); }
  </style>
</head>
<body>
  <div class="page-scale-wrapper" id="wrapper">
    <div class="page" id="page">
${bodyHtml}
    </div>
  </div>
  <script>
    (function () {
      var PAGE_WIDTH = 1000;
      var PAGE_HEIGHT = ${totalHeight};
      var page = document.getElementById('page');
      var wrapper = document.getElementById('wrapper');
      function applyScale() {
        var vw = window.innerWidth;
        if (vw < PAGE_WIDTH) {
          var scale = vw / PAGE_WIDTH;
          page.style.transform = 'scale(' + scale + ')';
          page.style.transformOrigin = 'top left';
          wrapper.style.height = (PAGE_HEIGHT * scale) + 'px';
          wrapper.style.overflow = 'hidden';
          wrapper.style.justifyContent = 'flex-start';
        } else {
          page.style.transform = '';
          page.style.transformOrigin = '';
          wrapper.style.height = '';
          wrapper.style.overflow = '';
          wrapper.style.justifyContent = 'center';
        }
      }
      applyScale();
      window.addEventListener('resize', applyScale);
    })();
  </script>
</body>
</html>`;
}

export function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
