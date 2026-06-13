import type { SiteElement, ElementType } from '../types';

const uid = (type: string) => `${type}-${Math.random().toString(36).slice(2, 9)}`;

export function createElement(type: ElementType): SiteElement {
  switch (type) {
    case 'text':
      return {
        id: uid('text'),
        type: 'text',
        content: '새 텍스트',
        style: { x: 100, y: 100, width: 300, height: 60, fontSize: 24, color: '#111827', backgroundColor: 'transparent', padding: 8 },
      };
    case 'button':
      return {
        id: uid('button'),
        type: 'button',
        content: '버튼',
        href: '#',
        style: { x: 120, y: 180, width: 160, height: 52, fontSize: 16, color: '#ffffff', backgroundColor: '#2563eb', borderRadius: 12, padding: 12 },
      };
    case 'image':
      return {
        id: uid('image'),
        type: 'image',
        content: '',
        src: 'https://placehold.co/320x200/e2e8f0/94a3b8?text=Image',
        alt: '이미지',
        style: { x: 150, y: 260, width: 320, height: 200, borderRadius: 16, backgroundColor: 'transparent' },
      };
    case 'card':
      return {
        id: uid('card'),
        type: 'card',
        content: '새 카드',
        subtitle: '카드 설명을 입력하세요',
        style: { x: 180, y: 320, width: 300, height: 180, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, fontSize: 18, color: '#111827', fontWeight: '600' },
      };
    case 'heading':
      return {
        id: uid('heading'),
        type: 'heading',
        content: '새 제목',
        style: { x: 100, y: 100, width: 400, height: 70, fontSize: 36, color: '#111827', backgroundColor: 'transparent', fontWeight: '700', textAlign: 'left' },
      };
    default:
      return {
        id: uid('text'),
        type: 'text',
        content: '새 요소',
        style: { x: 100, y: 100, width: 300, height: 60, fontSize: 16, color: '#111827', backgroundColor: 'transparent' },
      };
  }
}

// Deep-copies an element with a new ID; offsets x/y so the duplicate is visually distinct
export function duplicateElement(el: SiteElement): SiteElement {
  return {
    ...el,
    id: uid(el.type),
    style: { ...el.style, x: el.style.x + 24, y: el.style.y + 24 },
    children: el.children?.map((child) => duplicateElement(child)),
  };
}

// Recursively removes an element from the tree by ID
export function deleteElementFromTree(elements: SiteElement[], id: string): SiteElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) =>
      el.children?.length
        ? { ...el, children: deleteElementFromTree(el.children, id) }
        : el,
    );
}
