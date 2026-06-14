import { useState } from 'react';
import type { SiteElement } from '../types';
import { importFromHtml } from '../utils/importHtml';

interface Props {
  onImport: (elements: SiteElement[], title: string) => void;
  onClose: () => void;
}

const PLACEHOLDER_HTML = `<header class="hero">
  <h1>My Website</h1>
  <p>Welcome to my site!</p>
  <a href="#">Get Started</a>
</header>
<section class="cards">
  <h2>Features</h2>
  <div class="card">
    <h3>Feature A</h3>
    <p>Description here.</p>
  </div>
  <div class="card">
    <h3>Feature B</h3>
    <p>Description here.</p>
  </div>
</section>`;

const PLACEHOLDER_CSS = `.hero {
  background-color: #111827;
  color: #ffffff;
  padding: 80px;
}
.card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
}`;

export function ImportModal({ onImport, onClose }: Props) {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [tab, setTab] = useState<'code' | 'preview'>('code');
  const [error, setError] = useState<string | null>(null);

  const previewDoc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}${css}</style></head><body>${html}</body></html>`;

  function handleImport() {
    if (!html.trim()) { setError('HTML을 입력해주세요'); return; }
    try {
      const { elements, title } = importFromHtml(html, css);
      if (elements.length === 0) { setError('가져올 수 있는 요소를 찾지 못했습니다. h1, p, button, section 등이 있는지 확인해주세요.'); return; }
      onImport(elements, title);
    } catch (e) {
      setError('파싱 오류: ' + String(e));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-[920px] max-w-[96vw] flex flex-col" style={{ height: '620px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">웹사이트 가져오기</h2>
            <p className="text-xs text-slate-400 mt-0.5">HTML/CSS를 붙여넣으면 Paletto 요소로 변환됩니다</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 flex-shrink-0">
          {(['code', 'preview'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                tab === t
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'code' ? '코드 입력' : '원본 미리보기'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 p-5">
          {tab === 'code' ? (
            <div className="flex gap-4 h-full">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  HTML
                </label>
                <textarea
                  className="flex-1 min-h-0 text-xs font-mono border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 leading-relaxed"
                  placeholder={PLACEHOLDER_HTML}
                  value={html}
                  onChange={(e) => { setHtml(e.target.value); setError(null); }}
                  spellCheck={false}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  CSS <span className="font-normal normal-case">(선택)</span>
                </label>
                <textarea
                  className="flex-1 min-h-0 text-xs font-mono border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 leading-relaxed"
                  placeholder={PLACEHOLDER_CSS}
                  value={css}
                  onChange={(e) => { setCss(e.target.value); setError(null); }}
                  spellCheck={false}
                />
              </div>
            </div>
          ) : (
            <div className="h-full border border-slate-200 rounded-lg overflow-hidden bg-white">
              {html.trim() ? (
                <iframe
                  title="import-preview"
                  srcDoc={previewDoc}
                  className="w-full h-full"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">코드 입력 탭에서 HTML을 붙여넣으면<br />여기서 미리볼 수 있습니다</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex-1 mr-4">
            {error ? (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            ) : (
              <p className="text-xs text-slate-400">
                지원 태그: h1-h3, p, a, button, img, div.card, section, header, main 등
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              취소
            </button>
            <button
              onClick={handleImport}
              disabled={!html.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              캔버스에 가져오기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
