export type StyleMap = Record<string, string>;

export interface CSSRule {
  selector: string;
  styles: StyleMap;
}

function parseDeclarations(block: string): StyleMap {
  const styles: StyleMap = {};
  block.split(';').forEach((decl) => {
    const idx = decl.indexOf(':');
    if (idx === -1) return;
    const key = decl.slice(0, idx).trim().toLowerCase();
    const val = decl.slice(idx + 1).trim();
    if (key && val) styles[key] = val;
  });
  return styles;
}

export function parseCSS(css: string): CSSRule[] {
  const rules: CSSRule[] = [];
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{@]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const selector = m[1].trim();
    const styles = parseDeclarations(m[2]);
    if (selector && Object.keys(styles).length > 0) {
      selector.split(',').forEach((sel) => {
        const s = sel.trim();
        if (s) rules.push({ selector: s, styles });
      });
    }
  }
  return rules;
}

export function resolveStyle(el: Element, rules: CSSRule[]): StyleMap {
  const result: StyleMap = {};
  for (const rule of rules) {
    try {
      if (el.matches(rule.selector)) Object.assign(result, rule.styles);
    } catch {
      // skip invalid selectors
    }
  }
  const inline = el.getAttribute('style') ?? '';
  if (inline) Object.assign(result, parseDeclarations(inline));
  return result;
}
