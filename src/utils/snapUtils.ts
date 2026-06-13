import type { SiteElement, GuideLine } from '../types';

const CANVAS_WIDTH = 1000;

interface SnapResult {
  x: number;
  y: number;
  guides: GuideLine[];
}

export function computeSnap(
  element: SiteElement,
  rawX: number,
  rawY: number,
  allElements: SiteElement[],
  threshold = 6,
): SnapResult {
  const w = element.style.width;
  const h = element.style.height;

  // Vertical snap targets: canvas left, center, right + other elements' left/cx/right
  const vTargets: number[] = [0, CANVAS_WIDTH / 2, CANVAS_WIDTH];
  // Horizontal snap targets: canvas top edge + other elements' top/cy/bottom
  const hTargets: number[] = [0];

  for (const other of allElements) {
    if (other.id === element.id) continue;
    const os = other.style;
    vTargets.push(os.x, os.x + os.width / 2, os.x + os.width);
    hTargets.push(os.y, os.y + os.height / 2, os.y + os.height);
  }

  let snappedX = rawX;
  let snappedY = rawY;
  const guides: GuideLine[] = [];

  // ── X snap: check element left, center, right against vertical targets ────
  let bestX: { pos: number; guideAt: number } | null = null;
  let bestXDist = threshold;
  for (const t of vTargets) {
    const dLeft = Math.abs(rawX - t);
    const dCx = Math.abs(rawX + w / 2 - t);
    const dRight = Math.abs(rawX + w - t);

    if (dLeft < bestXDist) { bestXDist = dLeft; bestX = { pos: t, guideAt: t }; }
    if (dCx < bestXDist) { bestXDist = dCx; bestX = { pos: t - w / 2, guideAt: t }; }
    if (dRight < bestXDist) { bestXDist = dRight; bestX = { pos: t - w, guideAt: t }; }
  }
  if (bestX) { snappedX = bestX.pos; guides.push({ type: 'vertical', position: bestX.guideAt }); }

  // ── Y snap: check element top, center, bottom against horizontal targets ──
  let bestY: { pos: number; guideAt: number } | null = null;
  let bestYDist = threshold;
  for (const t of hTargets) {
    const dTop = Math.abs(rawY - t);
    const dCy = Math.abs(rawY + h / 2 - t);
    const dBottom = Math.abs(rawY + h - t);

    if (dTop < bestYDist) { bestYDist = dTop; bestY = { pos: t, guideAt: t }; }
    if (dCy < bestYDist) { bestYDist = dCy; bestY = { pos: t - h / 2, guideAt: t }; }
    if (dBottom < bestYDist) { bestYDist = dBottom; bestY = { pos: t - h, guideAt: t }; }
  }
  if (bestY) { snappedY = bestY.pos; guides.push({ type: 'horizontal', position: bestY.guideAt }); }

  return { x: Math.max(0, snappedX), y: Math.max(0, snappedY), guides };
}
