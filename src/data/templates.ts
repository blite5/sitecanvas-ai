import type { SiteElement, TemplateKey } from '../types';

// Generates a unique element ID
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ─── CAFE TEMPLATE ───────────────────────────────────────────────────────────
const cafeTemplate = (): SiteElement[] => [
  {
    id: uid('section'),
    type: 'section',
    content: 'Hero',
    style: { x: 0, y: 0, width: 1000, height: 480, backgroundColor: '#1a0a00', borderRadius: 0, padding: 0, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '☕ Brew & Bloom Café',
        style: { x: 0, y: 140, width: 1000, height: 70, fontSize: 52, color: '#f5deb3', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '따뜻한 커피 한 잔으로 하루를 시작하세요. 정성을 담아 내린 스페셜티 커피와 홈베이킹.',
        style: { x: 150, y: 230, width: 700, height: 50, fontSize: 18, color: '#d4a472', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '메뉴 보기',
        href: '#menu',
        style: { x: 390, y: 310, width: 220, height: 52, fontSize: 16, color: '#1a0a00', backgroundColor: '#f5deb3', borderRadius: 26, padding: 16, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Menu',
    style: { x: 0, y: 500, width: 1000, height: 360, backgroundColor: '#fffbf5', borderRadius: 0, padding: 60, fontSize: 16, color: '#1a0a00' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '인기 메뉴',
        style: { x: 0, y: 520, width: 1000, height: 50, fontSize: 36, color: '#1a0a00', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '시그니처 라떼',
        subtitle: '깊은 에스프레소와 부드러운 우유의 조화. 6,500원',
        style: { x: 60, y: 590, width: 260, height: 160, fontSize: 18, color: '#1a0a00', backgroundColor: '#fff8f0', borderRadius: 16, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '아메리카노',
        subtitle: '선명한 산미와 깔끔한 뒷맛. 4,500원',
        style: { x: 370, y: 590, width: 260, height: 160, fontSize: 18, color: '#1a0a00', backgroundColor: '#fff8f0', borderRadius: 16, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '크루아상',
        subtitle: '버터 풍미 가득한 겹겹이 바삭한 페이스트리. 4,000원',
        style: { x: 680, y: 590, width: 260, height: 160, fontSize: 18, color: '#1a0a00', backgroundColor: '#fff8f0', borderRadius: 16, padding: 24, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Info',
    style: { x: 0, y: 880, width: 1000, height: 200, backgroundColor: '#3d1f00', borderRadius: 0, padding: 40, fontSize: 16, color: '#f5deb3' },
    children: [
      {
        id: uid('text'),
        type: 'text',
        content: '📍 서울시 마포구 연남동 123-4  |  🕗 매일 08:00 – 22:00  |  📞 02-1234-5678',
        style: { x: 0, y: 940, width: 1000, height: 40, fontSize: 16, color: '#f5deb3', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '인스타그램 @brewandbloom | 네이버 예약 가능',
        style: { x: 0, y: 990, width: 1000, height: 36, fontSize: 14, color: '#c8a87c', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
    ],
  },
];

// ─── PORTFOLIO TEMPLATE ──────────────────────────────────────────────────────
const portfolioTemplate = (): SiteElement[] => [
  {
    id: uid('section'),
    type: 'section',
    content: 'Hero',
    style: { x: 0, y: 0, width: 1000, height: 460, backgroundColor: '#0f172a', borderRadius: 0, padding: 0, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '안녕하세요, 저는 김지수입니다 👋',
        style: { x: 0, y: 140, width: 1000, height: 64, fontSize: 46, color: '#f8fafc', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다. React · TypeScript · Node.js',
        style: { x: 100, y: 224, width: 800, height: 50, fontSize: 18, color: '#94a3b8', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '프로젝트 보기',
        href: '#projects',
        style: { x: 330, y: 310, width: 180, height: 50, fontSize: 15, color: '#ffffff', backgroundColor: '#3b82f6', borderRadius: 25, padding: 14, fontWeight: '600' },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '이메일 연락',
        href: 'mailto:ji@example.com',
        style: { x: 530, y: 310, width: 160, height: 50, fontSize: 15, color: '#3b82f6', backgroundColor: 'transparent', borderRadius: 25, padding: 14, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Projects',
    style: { x: 0, y: 480, width: 1000, height: 420, backgroundColor: '#f8fafc', borderRadius: 0, padding: 60, fontSize: 16, color: '#0f172a' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '주요 프로젝트',
        style: { x: 0, y: 500, width: 1000, height: 50, fontSize: 34, color: '#0f172a', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('card'),
        type: 'card',
        content: 'E-Commerce 플랫폼',
        subtitle: 'React + TypeScript로 구축한 쇼핑몰. 월 5만 명 방문자.',
        style: { x: 60, y: 570, width: 260, height: 180, fontSize: 17, color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 12, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '실시간 채팅 앱',
        subtitle: 'WebSocket과 Node.js로 만든 채팅 서비스. 1,000+ DAU.',
        style: { x: 370, y: 570, width: 260, height: 180, fontSize: 17, color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 12, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: 'AI 대시보드',
        subtitle: 'OpenAI API 연동 데이터 분석 대시보드. 사내 생산성 30% 향상.',
        style: { x: 680, y: 570, width: 260, height: 180, fontSize: 17, color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 12, padding: 24, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Contact',
    style: { x: 0, y: 920, width: 1000, height: 160, backgroundColor: '#1e293b', borderRadius: 0, padding: 40, fontSize: 16, color: '#f8fafc' },
    children: [
      {
        id: uid('text'),
        type: 'text',
        content: '📧 ji@example.com  |  GitHub: github.com/jisu  |  LinkedIn: linkedin.com/in/jisu',
        style: { x: 0, y: 970, width: 1000, height: 40, fontSize: 16, color: '#94a3b8', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
    ],
  },
];

// ─── CLUB TEMPLATE ────────────────────────────────────────────────────────────
const clubTemplate = (): SiteElement[] => [
  {
    id: uid('section'),
    type: 'section',
    content: 'Hero',
    style: { x: 0, y: 0, width: 1000, height: 440, backgroundColor: '#7c3aed', borderRadius: 0, padding: 0, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '🎵 멜로디 음악 동아리',
        style: { x: 0, y: 140, width: 1000, height: 64, fontSize: 48, color: '#ffffff', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '음악으로 하나되는 우리. 장르 불문 모든 음악을 사랑하는 사람들의 공간.',
        style: { x: 100, y: 224, width: 800, height: 48, fontSize: 18, color: '#e9d5ff', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '가입 신청하기',
        href: '#join',
        style: { x: 390, y: 310, width: 220, height: 52, fontSize: 16, color: '#7c3aed', backgroundColor: '#ffffff', borderRadius: 26, padding: 16, fontWeight: '700' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Activities',
    style: { x: 0, y: 460, width: 1000, height: 380, backgroundColor: '#f5f3ff', borderRadius: 0, padding: 60, fontSize: 16, color: '#1a0040' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '주요 활동',
        style: { x: 0, y: 480, width: 1000, height: 50, fontSize: 34, color: '#4c1d95', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '정기 합주',
        subtitle: '매주 토요일 오후 2시, 학교 연습실에서 합주 연습을 진행합니다.',
        style: { x: 60, y: 550, width: 260, height: 170, fontSize: 17, color: '#1a0040', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '정기 공연',
        subtitle: '학기별 1회 교내 공연 및 외부 버스킹 참여.',
        style: { x: 370, y: 550, width: 260, height: 170, fontSize: 17, color: '#1a0040', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '음악 워크숍',
        subtitle: '작곡, 편곡, 레코딩 등 실력 향상 워크숍 진행.',
        style: { x: 680, y: 550, width: 260, height: 170, fontSize: 17, color: '#1a0040', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Join',
    style: { x: 0, y: 860, width: 1000, height: 200, backgroundColor: '#7c3aed', borderRadius: 0, padding: 50, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('text'),
        type: 'text',
        content: '신입 멤버 모집 중! 매 학기 초 지원 가능 | 문의: melody@university.ac.kr',
        style: { x: 0, y: 930, width: 1000, height: 40, fontSize: 17, color: '#e9d5ff', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
    ],
  },
];

// ─── EVENT TEMPLATE ───────────────────────────────────────────────────────────
const eventTemplate = (): SiteElement[] => [
  {
    id: uid('section'),
    type: 'section',
    content: 'Hero',
    style: { x: 0, y: 0, width: 1000, height: 500, backgroundColor: '#111827', borderRadius: 0, padding: 0, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('text'),
        type: 'text',
        content: '2026. 07. 15 SAT',
        style: { x: 0, y: 110, width: 1000, height: 36, fontSize: 16, color: '#fbbf24', textAlign: 'center', fontWeight: '600', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('heading'),
        type: 'heading',
        content: 'SUMMER TECH FEST 2026',
        style: { x: 50, y: 155, width: 900, height: 80, fontSize: 54, color: '#ffffff', fontWeight: '900', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '개발자와 디자이너가 함께하는 테크 컨퍼런스. 30개 세션 · 50명 연사 · 무료 입장',
        style: { x: 100, y: 260, width: 800, height: 50, fontSize: 18, color: '#9ca3af', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '무료 등록하기',
        href: '#register',
        style: { x: 350, y: 340, width: 300, height: 56, fontSize: 17, color: '#111827', backgroundColor: '#fbbf24', borderRadius: 28, padding: 16, fontWeight: '700' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Lineup',
    style: { x: 0, y: 520, width: 1000, height: 360, backgroundColor: '#f9fafb', borderRadius: 0, padding: 60, fontSize: 16, color: '#111827' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '세션 라인업',
        style: { x: 0, y: 540, width: 1000, height: 50, fontSize: 34, color: '#111827', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('card'),
        type: 'card',
        content: 'AI & 미래 개발',
        subtitle: '10:00 – ChatGPT, Claude를 실무에 적용하는 방법 (박민준)',
        style: { x: 60, y: 610, width: 260, height: 180, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', borderRadius: 12, padding: 22, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: 'Next.js 15 딥다이브',
        subtitle: '13:00 – App Router 완전 정복 (이수빈)',
        style: { x: 370, y: 610, width: 260, height: 180, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', borderRadius: 12, padding: 22, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '디자인 시스템',
        subtitle: '15:00 – Figma to Code 자동화 (최다은)',
        style: { x: 680, y: 610, width: 260, height: 180, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', borderRadius: 12, padding: 22, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Venue',
    style: { x: 0, y: 900, width: 1000, height: 160, backgroundColor: '#111827', borderRadius: 0, padding: 40, fontSize: 16, color: '#f9fafb' },
    children: [
      {
        id: uid('text'),
        type: 'text',
        content: '📍 서울 코엑스 컨벤션홀 B  |  🚇 삼성역 5·6번 출구  |  무료 주차 가능',
        style: { x: 0, y: 960, width: 1000, height: 40, fontSize: 16, color: '#9ca3af', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
    ],
  },
];

// ─── STARTUP (DEFAULT) TEMPLATE ───────────────────────────────────────────────
const startupTemplate = (): SiteElement[] => [
  {
    id: uid('section'),
    type: 'section',
    content: 'Hero',
    style: { x: 0, y: 0, width: 1000, height: 500, backgroundColor: '#020817', borderRadius: 0, padding: 0, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '더 나은 내일을 만드는 혁신',
        style: { x: 50, y: 160, width: 900, height: 80, fontSize: 54, color: '#f8fafc', fontWeight: '800', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '우리 팀은 최고의 기술로 여러분의 비즈니스를 성장시킵니다. 지금 시작하세요.',
        style: { x: 100, y: 260, width: 800, height: 50, fontSize: 18, color: '#94a3b8', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '무료로 시작하기',
        href: '#pricing',
        style: { x: 320, y: 340, width: 200, height: 52, fontSize: 16, color: '#ffffff', backgroundColor: '#3b82f6', borderRadius: 26, padding: 16, fontWeight: '700' },
      },
      {
        id: uid('button'),
        type: 'button',
        content: '데모 보기',
        href: '#demo',
        style: { x: 540, y: 340, width: 160, height: 52, fontSize: 16, color: '#94a3b8', backgroundColor: 'transparent', borderRadius: 26, padding: 16, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'Features',
    style: { x: 0, y: 520, width: 1000, height: 380, backgroundColor: '#f8fafc', borderRadius: 0, padding: 60, fontSize: 16, color: '#020817' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '왜 우리를 선택하나요?',
        style: { x: 0, y: 540, width: 1000, height: 50, fontSize: 36, color: '#020817', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '⚡ 빠른 속도',
        subtitle: '업계 최고 수준의 성능으로 사용자 경험을 극대화합니다.',
        style: { x: 60, y: 610, width: 260, height: 170, fontSize: 17, color: '#020817', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '🔒 강력한 보안',
        subtitle: 'SOC2 Type II 인증. 여러분의 데이터는 항상 안전합니다.',
        style: { x: 370, y: 610, width: 260, height: 170, fontSize: 17, color: '#020817', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
      {
        id: uid('card'),
        type: 'card',
        content: '🤝 전문 지원',
        subtitle: '24시간 전담 지원팀이 항상 곁에 있습니다.',
        style: { x: 680, y: 610, width: 260, height: 170, fontSize: 17, color: '#020817', backgroundColor: '#ffffff', borderRadius: 14, padding: 24, fontWeight: '600' },
      },
    ],
  },
  {
    id: uid('section'),
    type: 'section',
    content: 'CTA',
    style: { x: 0, y: 920, width: 1000, height: 180, backgroundColor: '#3b82f6', borderRadius: 0, padding: 50, fontSize: 16, color: '#ffffff' },
    children: [
      {
        id: uid('heading'),
        type: 'heading',
        content: '지금 바로 시작하세요',
        style: { x: 0, y: 945, width: 1000, height: 50, fontSize: 32, color: '#ffffff', fontWeight: '700', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
      {
        id: uid('text'),
        type: 'text',
        content: '30일 무료 체험 · 신용카드 불필요 · 언제든 취소 가능',
        style: { x: 0, y: 1000, width: 1000, height: 36, fontSize: 15, color: '#bfdbfe', textAlign: 'center', backgroundColor: 'transparent', borderRadius: 0, padding: 0 },
      },
    ],
  },
];

// ─── TEMPLATE MAP ─────────────────────────────────────────────────────────────

export const TEMPLATE_MAP: Record<TemplateKey, () => SiteElement[]> = {
  cafe: cafeTemplate,
  portfolio: portfolioTemplate,
  club: clubTemplate,
  event: eventTemplate,
  startup: startupTemplate,
};

export const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  cafe: '☕ 카페 홈페이지',
  portfolio: '👤 개인 포트폴리오',
  club: '🎵 동아리 소개',
  event: '🎉 행사 홍보',
  startup: '🚀 스타트업 랜딩',
};

// Detect template key from user prompt
export function detectTemplate(prompt: string): TemplateKey {
  const p = prompt.toLowerCase();
  if (p.includes('카페') || p.includes('cafe') || p.includes('커피')) return 'cafe';
  if (p.includes('포트폴리오') || p.includes('portfolio') || p.includes('자기소개')) return 'portfolio';
  if (p.includes('동아리') || p.includes('club') || p.includes('모임')) return 'club';
  if (p.includes('행사') || p.includes('이벤트') || p.includes('event') || p.includes('컨퍼런스')) return 'event';
  return 'startup';
}
