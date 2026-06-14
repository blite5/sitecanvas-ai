import type { SiteElement } from '../types';
import { parseCSS, resolveStyle } from './cssParser';
import type { CSSRule } from './cssParser';

const uid = (t: string) => `${t}-${Math.random().toString(36).slice(2, 9)}`;

function px(val: string | null | undefined): number | undefined {
  if (val == null) return undefined;
  const n = parseFloat(val);
  return isNaN(n) ? undefined : n;
}

function clr(val: string | undefined): string | undefined {
  if (!val || val === 'transparent' || val === 'inherit' || val === 'initial') return undefined;
  return val;
}

function align(val: string | undefined): 'left' | 'center' | 'right' | undefined {
  if (val === 'left' || val === 'center' || val === 'right') return val;
  return undefined;
}

const CONTAINERS = new Set(['header', 'section', 'main', 'footer', 'nav', 'article']);

function isCard(el: Element, s: Record<string, string>): boolean {
  const tag = el.tagName.toLowerCase();
  if (!['div', 'article', 'li'].includes(tag)) return false;
  const cls = (el.getAttribute('class') ?? '').toLowerCase();
  if (cls.includes('card') || cls.includes('item')) return true;
  if (s['box-shadow'] !== undefined && s['border-radius'] !== undefined) return true;
  const childCount = el.children.length;
  return (
    childCount <= 4 &&
    el.querySelector('h1,h2,h3,h4,h5,h6') !== null &&
    el.querySelector('p') !== null
  );
}

function mkHeading(el: Element, s: Record<string, string>, x: number, y: number): SiteElement {
  const sizes: Record<string, number> = { h1: 48, h2: 36, h3: 28, h4: 22, h5: 18, h6: 16 };
  return {
    id: uid('heading'),
    type: 'heading',
    content: el.textContent?.trim() ?? '',
    style: {
      x, y, width: 840, height: 64,
      fontSize: px(s['font-size']) ?? sizes[el.tagName.toLowerCase()] ?? 28,
      color: clr(s['color']) ?? '#111827',
      fontWeight: '700',
      textAlign: align(s['text-align']) ?? 'left',
    },
  };
}

function mkText(el: Element, s: Record<string, string>, x: number, y: number): SiteElement {
  return {
    id: uid('text'),
    type: 'text',
    content: el.textContent?.trim() ?? '',
    style: {
      x, y, width: 840, height: 72,
      fontSize: px(s['font-size']) ?? 16,
      color: clr(s['color']) ?? '#374151',
      textAlign: align(s['text-align']),
    },
  };
}

function mkButton(el: Element, s: Record<string, string>, x: number, y: number): SiteElement {
  return {
    id: uid('button'),
    type: 'button',
    content: el.textContent?.trim() ?? 'Button',
    href: el.tagName.toLowerCase() === 'a' ? (el.getAttribute('href') ?? '#') : '#',
    style: {
      x, y, width: 220, height: 52,
      fontSize: px(s['font-size']) ?? 16,
      color: clr(s['color']) ?? '#ffffff',
      backgroundColor: clr(s['background-color']) ?? '#2563eb',
      borderRadius: px(s['border-radius']) ?? 12,
      padding: px(s['padding']) ?? 16,
      fontWeight: '600',
    },
  };
}

function mkImage(el: Element, s: Record<string, string>, x: number, y: number): SiteElement {
  return {
    id: uid('image'),
    type: 'image',
    content: '',
    src: el.getAttribute('src') ?? '',
    alt: el.getAttribute('alt') ?? '',
    style: {
      x, y,
      width: px(el.getAttribute('width') ?? s['width']) ?? 320,
      height: px(el.getAttribute('height') ?? s['height']) ?? 200,
    },
  };
}

function mkCard(
  el: Element,
  s: Record<string, string>,
  x: number,
  y: number,
  w: number
): SiteElement {
  const h = el.querySelector('h1,h2,h3,h4,h5,h6');
  const p = el.querySelector('p');
  return {
    id: uid('card'),
    type: 'card',
    content: h?.textContent?.trim() ?? el.textContent?.trim().slice(0, 40) ?? 'Card',
    subtitle: p?.textContent?.trim() ?? '',
    style: {
      x, y, width: w, height: 160,
      fontSize: 18,
      color: clr(s['color']) ?? '#111827',
      backgroundColor: clr(s['background-color']) ?? '#ffffff',
      borderRadius: px(s['border-radius']) ?? 16,
      padding: px(s['padding']) ?? 24,
      fontWeight: '600',
    },
  };
}

type Group = { type: 'cards'; els: Element[] } | { type: 'leaf'; el: Element };

function processChildren(
  children: Element[],
  rules: CSSRule[],
  startY: number
): { leaves: SiteElement[]; endY: number } {
  const leaves: SiteElement[] = [];
  let y = startY;

  const groups: Group[] = [];
  let cardBuf: Element[] = [];

  for (const child of children) {
    const tag = child.tagName.toLowerCase();
    if (['script', 'style', 'meta', 'link'].includes(tag)) continue;
    const s = resolveStyle(child, rules);
    if (isCard(child, s)) {
      cardBuf.push(child);
    } else {
      if (cardBuf.length > 0) {
        groups.push({ type: 'cards', els: cardBuf });
        cardBuf = [];
      }
      groups.push({ type: 'leaf', el: child });
    }
  }
  if (cardBuf.length > 0) groups.push({ type: 'cards', els: cardBuf });

  for (const g of groups) {
    if (g.type === 'cards') {
      const W = 260;
      const H = 160;
      const XS = [80, 360, 640];
      g.els.forEach((card, i) => {
        const row = Math.floor(i / 3);
        leaves.push(mkCard(card, resolveStyle(card, rules), XS[i % 3], y + row * (H + 28), W));
      });
      y += Math.ceil(g.els.length / 3) * (H + 28);
      continue;
    }

    const el = g.el;
    const tag = el.tagName.toLowerCase();
    const s = resolveStyle(el, rules);
    const text = el.textContent?.trim() ?? '';
    let leaf: SiteElement | null = null;

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      leaf = mkHeading(el, s, 80, y);
    } else if (['p', 'span'].includes(tag) && text) {
      leaf = mkText(el, s, 80, y);
    } else if (['a', 'button'].includes(tag) && text) {
      leaf = mkButton(el, s, 80, y);
    } else if (tag === 'img') {
      leaf = mkImage(el, s, 600, y);
    } else if (text) {
      leaf = mkText(el, s, 80, y);
    }

    if (leaf) {
      leaves.push(leaf);
      y += leaf.style.height + 24;
    }
  }

  return { leaves, endY: y };
}

export function importFromHtml(
  htmlString: string,
  cssString: string
): { elements: SiteElement[]; title: string } {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const title = doc.querySelector('title')?.textContent?.trim() ?? '';

  const inlineCSS = Array.from(doc.querySelectorAll('style'))
    .map((s) => s.textContent ?? '')
    .join('\n');
  const rules = parseCSS(inlineCSS + '\n' + cssString);

  const elements: SiteElement[] = [];
  let currentY = 0;

  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'meta', 'link'].includes(tag)) continue;

    const s = resolveStyle(el, rules);

    if (CONTAINERS.has(tag) || (tag === 'div' && !isCard(el, s))) {
      const bgColor = clr(s['background-color']) ?? '#ffffff';
      const padding = Math.min(px(s['padding']) ?? 60, 80);

      const { leaves, endY } = processChildren(
        Array.from(el.children),
        rules,
        currentY + padding
      );

      const sectionH = Math.max(200, endY - currentY + padding);
      elements.push({
        id: uid('section'),
        type: 'section',
        content: '',
        style: { x: 0, y: currentY, width: 1000, height: sectionH, backgroundColor: bgColor },
      });
      elements.push(...leaves);
      currentY += sectionH + 40;
    } else {
      const text = el.textContent?.trim() ?? '';
      let leaf: SiteElement | null = null;

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        leaf = mkHeading(el, s, 80, currentY);
      } else if (['p', 'span'].includes(tag) && text) {
        leaf = mkText(el, s, 80, currentY);
      } else if (['a', 'button'].includes(tag) && text) {
        leaf = mkButton(el, s, 80, currentY);
      } else if (tag === 'img') {
        leaf = mkImage(el, s, 80, currentY);
      } else if (text) {
        leaf = mkText(el, s, 80, currentY);
      }

      if (leaf) {
        elements.push(leaf);
        currentY += leaf.style.height + 24;
      }
    }
  }

  return { elements, title };
}
