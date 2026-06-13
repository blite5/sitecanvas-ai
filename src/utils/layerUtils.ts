import type { SiteElement } from '../types';

type Direction = 'forward' | 'backward' | 'front' | 'back';

function moveInLevel(elements: SiteElement[], id: string, dir: Direction): SiteElement[] | null {
  const idx = elements.findIndex((el) => el.id === id);
  if (idx === -1) return null;

  const arr = [...elements];
  switch (dir) {
    case 'forward':
      if (idx < arr.length - 1) [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      break;
    case 'backward':
      if (idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      break;
    case 'front': {
      const [el] = arr.splice(idx, 1);
      arr.push(el);
      break;
    }
    case 'back': {
      const [el] = arr.splice(idx, 1);
      arr.unshift(el);
      break;
    }
  }
  return arr;
}

function moveElement(elements: SiteElement[], id: string, dir: Direction): SiteElement[] {
  const result = moveInLevel(elements, id, dir);
  if (result) return result;

  return elements.map((el) => {
    if (!el.children?.length) return el;
    const moved = moveInLevel(el.children, id, dir);
    if (moved) return { ...el, children: moved };
    return { ...el, children: moveElement(el.children, id, dir) };
  });
}

export const bringForward = (elements: SiteElement[], id: string) => moveElement(elements, id, 'forward');
export const sendBackward = (elements: SiteElement[], id: string) => moveElement(elements, id, 'backward');
export const bringToFront = (elements: SiteElement[], id: string) => moveElement(elements, id, 'front');
export const sendToBack = (elements: SiteElement[], id: string) => moveElement(elements, id, 'back');
