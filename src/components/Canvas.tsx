import { useState, useCallback } from 'react';
import type { SiteElement, ViewMode, GuideLine } from '../types';
import { EditableElement } from './EditableElement';

interface Props {
  elements: SiteElement[];
  selectedId: string | null;
  viewMode: ViewMode;
  onSelectElement: (id: string | null) => void;
  onMoveElement: (id: string, dx: number, dy: number) => void;
  onMoveStart: () => void;
  onMoveEnd: (didDrag: boolean) => void;
}

const DESKTOP_WIDTH = 1000;
const MOBILE_WIDTH = 390;
const MOBILE_SCALE = MOBILE_WIDTH / DESKTOP_WIDTH;

// Depth-first flatten — order determines render / z-index
export function flattenElements(elements: SiteElement[]): SiteElement[] {
  const result: SiteElement[] = [];
  for (const el of elements) {
    result.push(el);
    if (el.children?.length) result.push(...flattenElements(el.children));
  }
  return result;
}

export function Canvas({
  elements,
  selectedId,
  viewMode,
  onSelectElement,
  onMoveElement,
  onMoveStart,
  onMoveEnd,
}: Props) {
  const [guides, setGuides] = useState<GuideLine[]>([]);

  const isMobilePreview = viewMode === 'mobile';
  const allFlat = flattenElements(elements);

  const totalHeight = Math.max(
    1080,
    ...allFlat.map((el) => el.style.y + el.style.height + 40),
  );

  const displayWidth = isMobilePreview ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const displayHeight = isMobilePreview ? totalHeight * MOBILE_SCALE : totalHeight;

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onSelectElement(null);
    },
    [onSelectElement],
  );

  return (
    <div className="flex-1 overflow-auto bg-slate-100 flex flex-col items-center py-10 px-10 gap-3">

      {isMobilePreview && (
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium"
          style={{ width: MOBILE_WIDTH }}
        >
          <svg className="w-4 h-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          모바일 미리보기 모드 — 드래그는 데스크톱 모드에서만 가능합니다
        </div>
      )}

      <div
        style={{
          position: 'relative',
          flexShrink: 0,
          width: displayWidth,
          ...(isMobilePreview
            ? { height: displayHeight, overflow: 'hidden' }
            : { minHeight: totalHeight }),
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          transition: 'width 0.3s ease',
        }}
      >
        <div
          style={{
            position: isMobilePreview ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: DESKTOP_WIDTH,
            minHeight: totalHeight,
            backgroundColor: '#ffffff',
            ...(isMobilePreview
              ? { transform: `scale(${MOBILE_SCALE})`, transformOrigin: 'top left' }
              : {}),
          }}
          onClick={handleCanvasClick}
        >
          {/* Elements rendered in flat order; z-index = array position + 1 */}
          {allFlat.map((el, idx) => (
            <EditableElement
              key={el.id}
              element={el}
              isSelected={selectedId === el.id}
              zIndex={selectedId === el.id ? allFlat.length + 10 : idx + 1}
              snapElements={allFlat}
              onSelect={onSelectElement}
              onMove={onMoveElement}
              onMoveStart={onMoveStart}
              onMoveEnd={onMoveEnd}
              onGuideChange={setGuides}
              canvasScale={1}
              isMobilePreview={isMobilePreview}
            />
          ))}

          {/* Alignment guide lines — desktop only, pointer-events none */}
          {!isMobilePreview && guides.map((guide, i) =>
            guide.type === 'vertical' ? (
              <div
                key={`v${i}`}
                style={{
                  position: 'absolute',
                  left: guide.position,
                  top: 0,
                  width: 1,
                  height: totalHeight,
                  background: '#818cf8',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  opacity: 0.85,
                }}
              />
            ) : (
              <div
                key={`h${i}`}
                style={{
                  position: 'absolute',
                  top: guide.position,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: '#818cf8',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  opacity: 0.85,
                }}
              />
            ),
          )}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none select-none">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm font-medium">아직 콘텐츠가 없어요</p>
              <p className="text-xs mt-1">왼쪽 패널에서 생성하거나 템플릿을 선택해 보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
