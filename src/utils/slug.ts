const KO_MAP: [RegExp, string][] = [
  [/카페/g, 'cafe'],
  [/커피/g, 'coffee'],
  [/포트폴리오/g, 'portfolio'],
  [/스타트업/g, 'startup'],
  [/클럽/g, 'club'],
  [/이벤트/g, 'event'],
  [/홈페이지/g, 'homepage'],
  [/웹사이트/g, ''],
  [/사이트/g, 'site'],
  [/쇼핑/g, 'shop'],
  [/블로그/g, 'blog'],
  [/레스토랑/g, 'restaurant'],
  [/음식/g, 'food'],
  [/여행/g, 'travel'],
  [/패션/g, 'fashion'],
  [/뷰티/g, 'beauty'],
  [/회사/g, 'company'],
  [/소개/g, 'about'],
  [/만들어줘/g, ''],
  [/만들어/g, ''],
  [/해줘/g, ''],
  [/내 /g, ''],
];

export function generateSiteId(name: string): string {
  let result = name;
  for (const [p, r] of KO_MAP) result = result.replace(p, r);
  result = result
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  const base = result || 'paletto-site';
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
