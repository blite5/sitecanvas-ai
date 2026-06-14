import { useState, useEffect } from 'react';
import type { SiteElement, ElementType } from '../types';

interface Props {
  element: SiteElement | null;
  /** Live update — no history (for text input preview) */
  onUpdate: (updated: SiteElement) => void;
  /** Commit update — pushes history */
  onCommit: (updated: SiteElement) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

const TYPE_CONFIG: Record<ElementType, { label: string; bg: string; text: string; dot: string }> = {
  text:    { label: 'TEXT',    bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  heading: { label: 'HEADING', bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  button:  { label: 'BUTTON',  bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  image:   { label: 'IMAGE',   bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-500'    },
  card:    { label: 'CARD',    bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-500'    },
  section: { label: 'SECTION', bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400'   },
  divider: { label: 'DIVIDER', bg: 'bg-gray-100',   text: 'text-gray-600',    dot: 'bg-gray-400'    },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full text-sm border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white';

// Text input with local draft state — live preview on change, commit on blur
function TextInput({
  value,
  onChange,
  onCommit,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [draft, setDraft] = useState(value);

  // Sync draft when value changes from outside (e.g., undo)
  useEffect(() => { setDraft(value); }, [value]);

  const handleChange = (v: string) => { setDraft(v); onChange(v); };
  const handleBlur = () => onCommit(draft);

  if (multiline) {
    return (
      <textarea
        className={`${inputCls} resize-none h-20`}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
  return (
    <input
      className={inputCls}
      value={draft}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}

function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number"
      className={inputCls}
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className="w-8 h-8 border border-slate-200 rounded-md cursor-pointer p-0.5 bg-white"
        value={value.startsWith('#') ? value : '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className={`flex-1 ${inputCls} font-mono`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
      />
    </div>
  );
}

export function PropertyPanel({
  element,
  onUpdate,
  onCommit,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
}: Props) {
  if (!element) {
    return (
      <aside className="w-60 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">속성 패널</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500">요소를 선택하세요</p>
          <p className="text-xs text-slate-400 mt-1">캔버스에서 요소를 클릭하면<br />여기서 편집할 수 있습니다</p>
        </div>
      </aside>
    );
  }

  const cfg = TYPE_CONFIG[element.type];

  // Live update helpers (no history)
  const live = (patch: Partial<SiteElement>) => onUpdate({ ...element, ...patch });

  // Commit helpers (pushes history)
  const commit = (patch: Partial<SiteElement>) => onCommit({ ...element, ...patch });
  const commitStyle = (patch: Partial<SiteElement['style']>) => commit({ style: { ...element.style, ...patch } });

  return (
    <aside className="w-60 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Type badge + id */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className="text-[11px] font-bold tracking-widest">{cfg.label}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
            #{element.id.slice(-6)}
          </span>
        </div>

        {/* Layer order */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">레이어 순서</p>
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: '맨뒤', title: '맨 뒤로 (⌘[)', action: onSendToBack },
              { label: '뒤로', title: '뒤로 보내기', action: onSendBackward },
              { label: '앞으로', title: '앞으로 보내기', action: onBringForward },
              { label: '맨앞', title: '맨 앞으로 (⌘])', action: onBringToFront },
            ].map(({ label, title, action }) => (
              <button
                key={label}
                onClick={action}
                title={title}
                className="py-1 text-[10px] font-medium text-slate-500 border border-slate-200 rounded hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Duplicate / Delete */}
        <div className="flex gap-2">
          <button
            onClick={onDuplicate}
            title="복제 (⌘D)"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            복제
          </button>
          <button
            onClick={onDelete}
            title="삭제 (Delete)"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {element.type === 'section' ? '섹션 삭제' : '삭제'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Content — text inputs use live+commit pattern */}
        {['text', 'heading', 'button', 'card'].includes(element.type) && (
          <Row label="내용">
            <TextInput
              value={element.content}
              onChange={(v) => live({ content: v })}
              onCommit={(v) => commit({ content: v })}
              multiline={element.type === 'text' || element.type === 'card'}
            />
          </Row>
        )}

        {element.type === 'card' && (
          <Row label="부제목">
            <TextInput
              value={element.subtitle ?? ''}
              onChange={(v) => live({ subtitle: v })}
              onCommit={(v) => commit({ subtitle: v })}
              multiline
              placeholder="설명 텍스트..."
            />
          </Row>
        )}

        {element.type === 'button' && (
          <Row label="링크 URL">
            <TextInput
              value={element.href ?? ''}
              onChange={(v) => live({ href: v })}
              onCommit={(v) => commit({ href: v })}
              placeholder="https://..."
            />
          </Row>
        )}

        {element.type === 'image' && (
          <>
            <Row label="이미지 URL">
              <TextInput
                value={element.src ?? ''}
                onChange={(v) => live({ src: v })}
                onCommit={(v) => commit({ src: v })}
                placeholder="https://..."
              />
            </Row>
            <Row label="대체 텍스트">
              <TextInput
                value={element.alt ?? ''}
                onChange={(v) => live({ alt: v })}
                onCommit={(v) => commit({ alt: v })}
                placeholder="이미지 설명"
              />
            </Row>
          </>
        )}

        {/* Layout — commits immediately */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">레이아웃</p>
          <div className="grid grid-cols-2 gap-2">
            <Row label="X"><NumberInput value={element.style.x} onChange={(v) => commitStyle({ x: v })} /></Row>
            <Row label="Y"><NumberInput value={element.style.y} onChange={(v) => commitStyle({ y: v })} /></Row>
            <Row label="너비"><NumberInput value={element.style.width} min={20} onChange={(v) => commitStyle({ width: v })} /></Row>
            <Row label="높이"><NumberInput value={element.style.height} min={10} onChange={(v) => commitStyle({ height: v })} /></Row>
          </div>
        </div>

        {/* Typography */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">타이포그래피</p>
          <Row label="글자 크기">
            <NumberInput value={element.style.fontSize ?? 16} min={8} max={120} onChange={(v) => commitStyle({ fontSize: v })} />
          </Row>
          <Row label="글자 색상">
            <ColorInput value={element.style.color ?? '#111827'} onChange={(v) => commitStyle({ color: v })} />
          </Row>
          <Row label="정렬">
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => commitStyle({ textAlign: align })}
                  className={`flex-1 py-1.5 text-xs rounded border transition-all ${
                    element.style.textAlign === align
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {align === 'left' ? '←' : align === 'center' ? '↔' : '→'}
                </button>
              ))}
            </div>
          </Row>
        </div>

        {/* Style */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">스타일</p>
          <Row label="배경색">
            <ColorInput value={element.style.backgroundColor ?? '#ffffff'} onChange={(v) => commitStyle({ backgroundColor: v })} />
          </Row>
          <Row label="모서리 반경">
            <NumberInput value={element.style.borderRadius ?? 0} min={0} max={100} onChange={(v) => commitStyle({ borderRadius: v })} />
          </Row>
          <Row label="패딩">
            <NumberInput value={element.style.padding ?? 0} min={0} max={100} onChange={(v) => commitStyle({ padding: v })} />
          </Row>
        </div>
      </div>
    </aside>
  );
}
