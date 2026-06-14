import { useState, useCallback, useEffect, useRef } from 'react';
import type { SiteElement, SiteData, ViewMode, TemplateKey } from './types';
import { TEMPLATE_MAP, detectTemplate } from './data/templates';
import { createElement, duplicateElement, deleteElementFromTree } from './utils/createElement';
import { bringForward, sendBackward, bringToFront, sendToBack } from './utils/layerUtils';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { ExportModal } from './components/ExportModal';
import { ImportModal } from './components/ImportModal';
import { PublishModal } from './components/PublishModal';
import { publishStorage } from './utils/publishStorage';
import { generateSiteId } from './utils/slug';
import type { PublishedSite } from './types';

const STORAGE_KEY = 'paletto-project';
const LEGACY_KEY = 'sitecanvas-ai-project';
const MAX_HISTORY = 50;

function createDefaultSite(): SiteData {
  return {
    id: crypto.randomUUID(),
    name: '내 웹사이트',
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function updateElementInTree(elements: SiteElement[], updated: SiteElement): SiteElement[] {
  return elements.map((el) => {
    if (el.id === updated.id) return updated;
    if (el.children?.length) return { ...el, children: updateElementInTree(el.children, updated) };
    return el;
  });
}

function findElementById(elements: SiteElement[], id: string): SiteElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children?.length) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

function moveElementInTree(elements: SiteElement[], id: string, dx: number, dy: number): SiteElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return {
        ...el,
        style: {
          ...el.style,
          x: Math.max(0, Math.round(el.style.x + dx)),
          y: Math.max(0, Math.round(el.style.y + dy)),
        },
      };
    }
    if (el.children?.length) return { ...el, children: moveElementInTree(el.children, id, dx, dy) };
    return el;
  });
}

export default function App() {
  const [site, setSite] = useState<SiteData>(createDefaultSite);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [publishResult, setPublishResult] = useState<{ siteId: string; isUpdate: boolean } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const [past, setPast] = useState<SiteElement[][]>([]);
  const [future, setFuture] = useState<SiteElement[][]>([]);
  const dragSnapshot = useRef<SiteElement[] | null>(null);

  useEffect(() => {
    setHasSaved(Boolean(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const pushHistory = useCallback((snapshot: SiteElement[]) => {
    setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), snapshot]);
    setFuture([]);
  }, []);

  const setElementsWithHistory = useCallback(
    (prevElements: SiteElement[], nextElements: SiteElement[]) => {
      setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), prevElements]);
      setFuture([]);
      setSite((s) => ({ ...s, elements: nextElements, updatedAt: new Date().toISOString() }));
    },
    [],
  );

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      const rest = p.slice(0, -1);
      setFuture((f) => [site.elements, ...f]);
      setSite((s) => ({ ...s, elements: prev, updatedAt: new Date().toISOString() }));
      setSelectedId(null);
      return rest;
    });
  }, [site.elements]);

  const handleRedo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      const rest = f.slice(1);
      setPast((p) => [...p, site.elements]);
      setSite((s) => ({ ...s, elements: next, updatedAt: new Date().toISOString() }));
      setSelectedId(null);
      return rest;
    });
  }, [site.elements]);

  // ── AI / Template ──────────────────────────────────────────────────────────
  const handleGenerate = useCallback(
    (prompt: string) => {
      setIsGenerating(true);
      const templateKey = detectTemplate(prompt);
      setTimeout(() => {
        const elements = TEMPLATE_MAP[templateKey]();
        const name = prompt.length > 30 ? prompt.slice(0, 30) + '…' : prompt;
        setElementsWithHistory(site.elements, elements);
        setSite((s) => ({ ...s, name }));
        setSelectedId(null);
        setIsGenerating(false);
        showToast(`✨ ${name} 생성 완료!`);
      }, 800);
    },
    [site.elements, setElementsWithHistory, showToast],
  );

  const handleSelectTemplate = useCallback(
    (key: TemplateKey) => {
      const elements = TEMPLATE_MAP[key]();
      setElementsWithHistory(site.elements, elements);
      setSelectedId(null);
      showToast('템플릿이 적용되었습니다');
    },
    [site.elements, setElementsWithHistory, showToast],
  );

  // ── Selection ──────────────────────────────────────────────────────────────
  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  // ── Drag ───────────────────────────────────────────────────────────────────
  const handleMoveStart = useCallback(() => {
    dragSnapshot.current = site.elements;
  }, [site.elements]);

  const handleMoveElement = useCallback((id: string, dx: number, dy: number) => {
    setSite((prev) => ({
      ...prev,
      elements: moveElementInTree(prev.elements, id, dx, dy),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleMoveEnd = useCallback(
    (didDrag: boolean) => {
      if (didDrag && dragSnapshot.current) {
        pushHistory(dragSnapshot.current);
      }
      dragSnapshot.current = null;
    },
    [pushHistory],
  );

  // ── Property panel: live update (no history) + commit (history) ────────────
  const handleUpdateElementLive = useCallback((updated: SiteElement) => {
    setSite((s) => ({
      ...s,
      elements: updateElementInTree(s.elements, updated),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleUpdateElement = useCallback(
    (updated: SiteElement) => {
      setElementsWithHistory(site.elements, updateElementInTree(site.elements, updated));
    },
    [site.elements, setElementsWithHistory],
  );

  // ── Add / Delete / Duplicate ───────────────────────────────────────────────
  const handleAddElement = useCallback(
    (type: Parameters<typeof createElement>[0]) => {
      const newEl = createElement(type);
      const next = [...site.elements, newEl];
      setElementsWithHistory(site.elements, next);
      setSelectedId(newEl.id);
      showToast('요소가 추가되었습니다');
    },
    [site.elements, setElementsWithHistory, showToast],
  );

  const handleDeleteElement = useCallback(() => {
    if (!selectedId) return;
    const next = deleteElementFromTree(site.elements, selectedId);
    setElementsWithHistory(site.elements, next);
    setSelectedId(null);
    showToast('요소가 삭제되었습니다');
  }, [selectedId, site.elements, setElementsWithHistory, showToast]);

  const handleDuplicateElement = useCallback(() => {
    if (!selectedId) return;
    const el = findElementById(site.elements, selectedId);
    if (!el) return;
    const copy = duplicateElement(el);
    const next = [...site.elements, copy];
    setElementsWithHistory(site.elements, next);
    setSelectedId(copy.id);
    showToast('요소가 복제되었습니다');
  }, [selectedId, site.elements, setElementsWithHistory, showToast]);

  // ── Layer order ────────────────────────────────────────────────────────────
  const handleBringForward = useCallback(() => {
    if (!selectedId) return;
    setElementsWithHistory(site.elements, bringForward(site.elements, selectedId));
  }, [selectedId, site.elements, setElementsWithHistory]);

  const handleSendBackward = useCallback(() => {
    if (!selectedId) return;
    setElementsWithHistory(site.elements, sendBackward(site.elements, selectedId));
  }, [selectedId, site.elements, setElementsWithHistory]);

  const handleBringToFront = useCallback(() => {
    if (!selectedId) return;
    setElementsWithHistory(site.elements, bringToFront(site.elements, selectedId));
  }, [selectedId, site.elements, setElementsWithHistory]);

  const handleSendToBack = useCallback(() => {
    if (!selectedId) return;
    setElementsWithHistory(site.elements, sendToBack(site.elements, selectedId));
  }, [selectedId, site.elements, setElementsWithHistory]);

  // ── Save / Load / Reset ────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
    setHasSaved(true);
    showToast('💾 저장되었습니다');
  }, [site, showToast]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!saved) return;
    try {
      const parsed: SiteData = JSON.parse(saved);
      setSite(parsed);
      setPast([]);
      setFuture([]);
      setSelectedId(null);
      showToast('📂 불러오기 완료');
    } catch {
      showToast('불러오기 실패: 저장된 데이터가 손상되었습니다');
    }
  }, [showToast]);

  const handleReset = useCallback(() => {
    if (!window.confirm('정말 초기화할까요? 현재 작업이 모두 사라집니다.')) return;
    setSite(createDefaultSite());
    setPast([]);
    setFuture([]);
    setSelectedId(null);
    showToast('초기화되었습니다');
  }, [showToast]);

  const handleImport = useCallback(
    (importedElements: SiteElement[], importedTitle: string) => {
      setElementsWithHistory(site.elements, importedElements);
      if (importedTitle) setSite((s) => ({ ...s, name: importedTitle }));
      setSelectedId(null);
      setShowImport(false);
      showToast(`✨ ${importedElements.length}개 요소를 가져왔습니다`);
    },
    [site.elements, setElementsWithHistory, showToast]
  );

  const handlePublish = useCallback(() => {
    if (isPublishing) return;
    setIsPublishing(true);
    (async () => {
      try {
        const isUpdate = Boolean(site.publishedSiteId);
        const siteId = site.publishedSiteId ?? generateSiteId(site.name);
        const prevVersion = isUpdate ? ((await publishStorage.get(siteId))?.version ?? 0) : 0;
        const published: PublishedSite = {
          id: siteId,
          name: site.name,
          elements: site.elements,
          createdAt: site.createdAt,
          updatedAt: new Date().toISOString(),
          version: prevVersion + 1,
        };
        await publishStorage.publish(published);
        const updatedSite = { ...site, publishedSiteId: siteId };
        setSite(updatedSite);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSite));
        setHasSaved(true);
        setPublishResult({ siteId, isUpdate });
        setShowPublish(true);
        showToast(isUpdate ? '🌐 페이지가 업데이트되었습니다' : '🚀 Site Published!');
      } catch (e) {
        console.error('[Paletto] Publish failed:', e);
        showToast('발행 중 문제가 발생했습니다');
      } finally {
        setIsPublishing(false);
      }
    })();
  }, [site, showToast, isPublishing]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  const handlersRef = useRef({
    handleUndo,
    handleRedo,
    handleDeleteElement,
    handleDuplicateElement,
    handleBringForward,
    handleSendBackward,
  });
  useEffect(() => {
    handlersRef.current = {
      handleUndo,
      handleRedo,
      handleDeleteElement,
      handleDuplicateElement,
      handleBringForward,
      handleSendBackward,
    };
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditing = tag === 'input' || tag === 'textarea';

      if (e.key === 'Escape') { setSelectedId(null); return; }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlersRef.current.handleUndo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handlersRef.current.handleRedo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && !isEditing) {
        e.preventDefault();
        handlersRef.current.handleDuplicateElement();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ']' && !isEditing) {
        e.preventDefault();
        handlersRef.current.handleBringForward();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '[' && !isEditing) {
        e.preventDefault();
        handlersRef.current.handleSendBackward();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
        e.preventDefault();
        handlersRef.current.handleDeleteElement();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedElement = selectedId ? findElementById(site.elements, selectedId) : null;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        projectName={site.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSave={handleSave}
        onLoad={handleLoad}
        onImport={() => setShowImport(true)}
        onExport={() => setShowExport(true)}
        onPublish={handlePublish}
        hasPublished={Boolean(site.publishedSiteId)}
        isPublishing={isPublishing}
        onReset={handleReset}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSaved={hasSaved}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onGenerate={handleGenerate}
          onSelectTemplate={handleSelectTemplate}
          onAddElement={handleAddElement}
          isGenerating={isGenerating}
          elements={site.elements}
          selectedId={selectedId}
          onSelectElement={handleSelectElement}
        />

        <Canvas
          elements={site.elements}
          selectedId={selectedId}
          viewMode={viewMode}
          onSelectElement={handleSelectElement}
          onMoveElement={handleMoveElement}
          onMoveStart={handleMoveStart}
          onMoveEnd={handleMoveEnd}
        />

        <PropertyPanel
          element={selectedElement}
          onUpdate={handleUpdateElementLive}
          onCommit={handleUpdateElement}
          onDelete={handleDeleteElement}
          onDuplicate={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
        />
      </div>

      {showExport && (
        <ExportModal
          elements={site.elements}
          siteName={site.name}
          onClose={() => setShowExport(false)}
        />
      )}

      {showImport && (
        <ImportModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {showPublish && publishResult && (
        <PublishModal
          siteId={publishResult.siteId}
          siteName={site.name}
          isUpdate={publishResult.isUpdate}
          onClose={() => setShowPublish(false)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
