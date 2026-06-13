import { useRef, useCallback, useState } from 'react';
import type { SiteElement, ElementType, GuideLine } from '../types';
import { computeSnap } from '../utils/snapUtils';

const TYPE_LABELS: Record<ElementType, string> = {
  text: 'TEXT',
  heading: 'HEADING',
  button: 'BUTTON',
  image: 'IMAGE',
  card: 'CARD',
  section: 'SECTION',
  divider: 'DIVIDER',
};

interface Props {
  element: SiteElement;
  isSelected: boolean;
  /** z-index to apply — provided by Canvas based on render order */
  zIndex: number;
  /** All elements on canvas (for snap target calculation) */
  snapElements: SiteElement[];
  onSelect: (id: string) => void;
  onMove: (id: string, dx: number, dy: number) => void;
  onMoveStart: () => void;
  onMoveEnd: (didDrag: boolean) => void;
  onGuideChange: (guides: GuideLine[]) => void;
  canvasScale: number;
  isMobilePreview: boolean;
}

export function EditableElement({
  element,
  isSelected,
  zIndex,
  snapElements,
  onSelect,
  onMove,
  onMoveStart,
  onMoveEnd,
  onGuideChange,
  canvasScale,
  isMobilePreview,
}: Props) {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(element.id);
      onMoveStart();

      if (isMobilePreview) {
        onMoveEnd(false);
        return;
      }

      isDragging.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };

      // Track element position locally for snap (closure captures start position)
      let localX = element.style.x;
      let localY = element.style.y;

      const onMouseMove = (me: MouseEvent) => {
        const rawDx = (me.clientX - dragStart.current.x) / canvasScale;
        const rawDy = (me.clientY - dragStart.current.y) / canvasScale;

        if (!isDragging.current && (Math.abs(rawDx) > 4 || Math.abs(rawDy) > 4)) {
          isDragging.current = true;
          document.body.classList.add('dragging');
        }

        if (isDragging.current) {
          const proposedX = localX + rawDx;
          const proposedY = localY + rawDy;

          const { x: snappedX, y: snappedY, guides } = computeSnap(
            element,
            proposedX,
            proposedY,
            snapElements,
          );

          onGuideChange(guides);

          const dx = snappedX - localX;
          const dy = snappedY - localY;
          if (dx !== 0 || dy !== 0) {
            onMove(element.id, dx, dy);
          }

          localX = snappedX;
          localY = snappedY;
          dragStart.current = { x: me.clientX, y: me.clientY };
        }
      };

      const onMouseUp = () => {
        document.body.classList.remove('dragging');
        onGuideChange([]); // clear guides on drag end
        onMoveEnd(isDragging.current);
        isDragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [
      element,
      snapElements,
      onSelect,
      onMove,
      onMoveStart,
      onMoveEnd,
      onGuideChange,
      canvasScale,
      isMobilePreview,
    ],
  );

  const s = element.style;
  const isSection = element.type === 'section';

  const outline = isSelected
    ? '2px solid #3b82f6'
    : isHovered && !isSection
    ? '1.5px solid #93c5fd'
    : 'none';

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: s.x,
    top: s.y,
    width: s.width,
    minHeight: s.height,
    fontSize: s.fontSize,
    color: s.color,
    backgroundColor: s.backgroundColor === 'transparent' ? undefined : s.backgroundColor,
    borderRadius: s.borderRadius,
    padding: s.padding,
    fontWeight: s.fontWeight as React.CSSProperties['fontWeight'],
    textAlign: s.textAlign,
    cursor: isMobilePreview ? 'default' : 'grab',
    userSelect: 'none',
    boxSizing: 'border-box',
    zIndex,
    outline,
    outlineOffset: '2px',
    transition: 'outline 0.1s ease',
  };

  const handlers = {
    onMouseDown: handleMouseDown,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  switch (element.type) {
    case 'heading':
      return (
        <div style={baseStyle} {...handlers}>
          <h2 style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', textAlign: 'inherit', lineHeight: 1.2 }}>
            {element.content}
          </h2>
          {isSelected && <SelectionBadge label={TYPE_LABELS.heading} />}
        </div>
      );

    case 'text':
      return (
        <div style={baseStyle} {...handlers}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{element.content}</p>
          {isSelected && <SelectionBadge label={TYPE_LABELS.text} />}
        </div>
      );

    case 'button':
      return (
        <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...handlers}>
          <span style={{ pointerEvents: 'none' }}>{element.content}</span>
          {isSelected && <SelectionBadge label={TYPE_LABELS.button} />}
        </div>
      );

    case 'image':
      return (
        <div style={{ ...baseStyle, overflow: 'hidden' }} {...handlers}>
          <img
            src={element.src ?? 'https://placehold.co/300x200/e2e8f0/94a3b8?text=Image'}
            alt={element.alt ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
          {isSelected && <SelectionBadge label={TYPE_LABELS.image} />}
        </div>
      );

    case 'card':
      return (
        <div style={baseStyle} {...handlers}>
          <div style={{ fontWeight: s.fontWeight ?? '600', marginBottom: 8, fontSize: s.fontSize }}>{element.content}</div>
          {element.subtitle && (
            <div style={{ fontSize: (s.fontSize ?? 16) - 3, color: '#6b7280', lineHeight: 1.4 }}>{element.subtitle}</div>
          )}
          {isSelected && <SelectionBadge label={TYPE_LABELS.card} />}
        </div>
      );

    case 'section':
      return (
        <div style={{ ...baseStyle, overflow: 'hidden' }} {...handlers}>
          {isSelected && <SelectionBadge label={TYPE_LABELS.section} color="#64748b" />}
        </div>
      );

    case 'divider':
      return (
        <div style={baseStyle} {...handlers}>
          <hr style={{ border: 'none', borderTop: `2px solid ${s.color ?? '#e5e7eb'}`, margin: 0 }} />
          {isSelected && <SelectionBadge label={TYPE_LABELS.divider} />}
        </div>
      );

    default:
      return null;
  }
}

function SelectionBadge({ label, color = '#3b82f6' }: { label: string; color?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: -24,
        left: -2,
        backgroundColor: color,
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '4px 4px 0 0',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'ui-monospace, Consolas, monospace',
        letterSpacing: 0.8,
      }}
    >
      {label}
    </div>
  );
}
