// Core element types supported in the canvas
export type ElementType = 'text' | 'button' | 'image' | 'card' | 'section' | 'heading' | 'divider';

export interface ElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
}

export interface SiteElement {
  id: string;
  type: ElementType;
  content: string;
  // For button elements
  href?: string;
  // For image elements
  src?: string;
  alt?: string;
  // For card elements
  subtitle?: string;
  // Children for section/card containers
  children?: SiteElement[];
  style: ElementStyle;
}

export interface SiteData {
  id: string;
  name: string;
  elements: SiteElement[];
  createdAt: string;
  updatedAt: string;
  publishedSiteId?: string;
}

export interface PublishedSite {
  id: string;
  name: string;
  elements: SiteElement[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface StorageAdapter {
  publish(site: PublishedSite): Promise<void>;
  get(siteId: string): Promise<PublishedSite | null>;
  getAll(): Promise<Record<string, PublishedSite>>;
}

export type ViewMode = 'desktop' | 'mobile';

export type TemplateKey = 'cafe' | 'portfolio' | 'club' | 'event' | 'startup';

export interface GuideLine {
  type: 'vertical' | 'horizontal';
  position: number;
}
