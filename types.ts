
// Enum representing the content categories used throughout the application.
export enum Category {
  NEWS = 'Berita',
  RESEARCH_ORIGINAL = 'Riset Original',
  DOKUMENTER = 'Dokumenter',
  JURNAL = 'Jurnal',
  BUKU = 'Buku',
  ARTIKEL_POPULER = 'Artikel Ilmiah Populer',
  ESSAI = 'Essai'
}

// Enum representing the status of content publications.
export enum ContentStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published'
}

// Structure for news and activity items.
export interface ActivityItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  location?: string;
  author: string;
  editor?: string;
  description: string;
  content: string; // Rich text / Markdown
  image: string;
  image_caption?: string;
  tags?: string[];
}

export interface Author {
  name: string;
  credentials: string;
  affiliation: string;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string; // HTML
  subsections?: Array<{
    id: string;
    title: string;
    content: string; // HTML
  }>;
}

// Core Journal interface representing research papers, documentaries, and articles.
export interface Journal {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: Category;
  // Common Fields
  authors: string[] | Author[];
  year: number;
  date_published: string;
  abstract: string;
  cover_image: string;
  tags?: string[];
  reading_time?: string;
  
  // Preview Jurnal (Garuda Style) fields
  journal_name?: string;
  volume?: string;
  issue?: string;
  doi?: string;
  external_url?: string;
  
  // Riset Original (Celios Style) fields
  full_content?: string;
  background_story?: string;
  key_findings?: string[];
  references?: string[];

  // Detailed Content Structure (New)
  content?: {
    introduction: string; // HTML
    sections: ContentSection[];
    conclusion: string; // HTML
  };

  // Support for media and source URLs
  pdf_url?: string;
  hide_pdf_preview?: boolean;
  download_url?: string;
  video_url?: string; // This is used for Embed/Trailer
  full_url?: string;  // New: Link to external full video (YouTube/Vimeo)
  status?: ContentStatus;
}

// Type definition for filtering logic in listings.
export interface FilterOptions {
  category: Category | 'Semua';
  year: number | 'Semua';
  search: string;
}

// Profile structure for individual team members.
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

// Global settings for the website's identity and profile information.
export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  contactEmail: string;
  contactAddress: string;
  visionStatement: string;
  aboutText: string;
  team: TeamMember[];
}
