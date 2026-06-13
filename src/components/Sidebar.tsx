import { useState } from 'react';
import type { TemplateKey, ElementType, SiteElement } from '../types';
import { TEMPLATE_LABELS } from '../data/templates';
import { LayerPanel } from './LayerPanel';

interface Props {
  onGenerate: (prompt: string) => void;
  onSelectTemplate: (key: TemplateKey) => void;
  onAddElement: (type: ElementType) => void;
  isGenerating: boolean;
  elements: SiteElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
}

const ADD_ELEMENTS: { type: ElementType; label: string; icon: string; desc: string }[] = [
  { type: 'text',    label: '텍스트',  icon: 'T',  desc: '단락 텍스트' },
  { type: 'heading', label: '제목',    icon: 'H',  desc: '큰 제목' },
  { type: 'button',  label: '버튼',    icon: '→',  desc: '클릭 버튼' },
  { type: 'image',   label: '이미지',  icon: '⬜', desc: '이미지 블록' },
  { type: 'card',    label: '카드',    icon: '▭',  desc: '제목+설명 카드' },
];

export function Sidebar({
  onGenerate,
  onSelectTemplate,
  onAddElement,
  isGenerating,
  elements,
  selectedId,
  onSelectElement,
}: Props) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt.trim());
    setPrompt('');
  };

  const templateKeys = Object.keys(TEMPLATE_LABELS) as TemplateKey[];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">

      {/* AI Generate */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-violet-600 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">AI 생성</span>
        </div>
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            placeholder="어떤 웹사이트를 만들까요?&#10;예) 카페 홈페이지 만들어줘"
            className="w-full text-sm border border-slate-200 rounded-lg p-3 resize-none h-24 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                생성 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                웹사이트 생성
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center">⌘+Enter로도 생성 가능</p>
        </div>
      </div>

      {/* Add Elements */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">요소 추가</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {ADD_ELEMENTS.map(({ type, label, icon, desc }) => (
            <button
              key={type}
              onClick={() => onAddElement(type)}
              title={desc}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all text-center"
            >
              <span className="text-base font-bold leading-none">{icon}</span>
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">템플릿</span>
        </div>
        <div className="space-y-1.5">
          {templateKeys.map((key) => (
            <button
              key={key}
              onClick={() => onSelectTemplate(key)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              {TEMPLATE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Panel */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">레이어</span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          <LayerPanel
            elements={elements}
            selectedId={selectedId}
            onSelectElement={onSelectElement}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-slate-600 mb-1.5">💡 단축키</p>
          <ul className="text-[11px] text-slate-500 space-y-0.5">
            <li>• ⌘Z / Ctrl+Z — 실행 취소</li>
            <li>• ⌘⇧Z — 다시 실행</li>
            <li>• ⌘D / Ctrl+D — 복제</li>
            <li>• ⌘] / ⌘[ — 앞/뒤로 보내기</li>
            <li>• Del / Backspace — 삭제</li>
            <li>• Esc — 선택 해제</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
