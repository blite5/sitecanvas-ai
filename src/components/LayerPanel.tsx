import type { SiteElement, ElementType } from '../types';

const TYPE_DOT: Record<ElementType, string> = {
  text:    'bg-emerald-500',
  heading: 'bg-purple-500',
  button:  'bg-orange-500',
  image:   'bg-pink-500',
  card:    'bg-cyan-500',
  section: 'bg-slate-400',
  divider: 'bg-gray-400',
};

const TYPE_LABEL: Record<ElementType, string> = {
  text: 'TEXT', heading: 'HEADING', button: 'BUTTON',
  image: 'IMAGE', card: 'CARD', section: 'SECTION', divider: 'DIVIDER',
};

function getLayerName(el: SiteElement): string {
  const raw = el.content || el.subtitle || el.alt || '';
  const trimmed = raw.trim();
  if (!trimmed) return TYPE_LABEL[el.type];
  return trimmed.length > 22 ? trimmed.slice(0, 22) + '…' : trimmed;
}

function flattenElements(elements: SiteElement[]): SiteElement[] {
  const result: SiteElement[] = [];
  for (const el of elements) {
    result.push(el);
    if (el.children?.length) result.push(...flattenElements(el.children));
  }
  return result;
}

interface Props {
  elements: SiteElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
}

export function LayerPanel({ elements, selectedId, onSelectElement }: Props) {
  // Reverse order: top of panel = highest z (rendered last)
  const flat = flattenElements(elements).slice().reverse();

  if (flat.length === 0) {
    return (
      <p className="text-[11px] text-slate-400 px-2 py-3 text-center">요소가 없습니다</p>
    );
  }

  return (
    <div className="space-y-0.5">
      {flat.map((el) => {
        const isSelected = el.id === selectedId;
        return (
          <button
            key={el.id}
            onClick={() => onSelectElement(el.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all ${
              isSelected
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_DOT[el.type]}`} />
            <span className={`text-[10px] font-bold tracking-wider flex-shrink-0 w-[52px] ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
              {TYPE_LABEL[el.type]}
            </span>
            <span className="text-[11px] truncate">{getLayerName(el)}</span>
          </button>
        );
      })}
    </div>
  );
}
