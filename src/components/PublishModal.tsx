import { useState } from 'react';

interface Props {
  siteId: string;
  siteName: string;
  isUpdate: boolean;
  onClose: () => void;
}

export function PublishModal({ siteId, siteName, isUpdate, onClose }: Props) {
  const url = `${window.location.origin}/p/${siteId}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[95vw]">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-slate-200">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {isUpdate ? '페이지가 업데이트됐습니다!' : '🚀 Site Published!'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[300px]">{siteName}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* URL display */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">공개 URL</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="flex-1 text-xs font-mono text-slate-700 truncate">{url}</span>
            </div>
          </div>

          {/* Version / Republish info */}
          {isUpdate && (
            <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              같은 URL로 업데이트됐습니다. 페이지를 새로고침하면 변경사항이 반영됩니다.
            </p>
          )}

          {/* Limitation notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">현재 한계:</span> localhost 기반이라 이 브라우저에서만 접근 가능합니다.
              다른 사람과 공유하려면 v0.8에서 DB 연동이 필요합니다.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={copyLink}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                copied
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? '복사됨 ✓' : 'Copy Link'}
            </button>
            <button
              onClick={() => window.open(`/p/${siteId}`, '_blank')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Site
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
