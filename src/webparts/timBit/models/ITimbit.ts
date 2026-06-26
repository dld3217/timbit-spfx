export interface ITimbit {
  id: number;
  title: string;
  date: string;           // YYYY/MM/DD
  weekOf: string;         // YYYY/MM/DD — Monday of that week, used to group email batches
  body: string;
  link: string;
  format: TimbitFormat;
  categories: string[];   // e.g. ["wifi","ai","partner"]
  keywords: string;
  published: boolean;
}

export type TimbitFormat =
  | 'video'
  | 'solution'
  | 'blog'
  | 'case-study'
  | 'infographic'
  | 'ebook'
  | 'webinar'
  | 'audio';

export const ALL_CATEGORIES = [
  'ai', 'wifi', 'iot', 'security', 'sase', '5g',
  'campus', 'datacenter', 'location', 'partner',
  'retail', 'healthcare', 'hospitality', 'education', 'manufacturing'
] as const;

export const ALL_FORMATS: TimbitFormat[] = [
  'video', 'solution', 'blog', 'case-study', 'infographic', 'ebook', 'webinar', 'audio'
];

export const FORMAT_LABELS: Record<TimbitFormat, string> = {
  video: 'Video',
  solution: 'Solution Overview',
  blog: 'Blog',
  'case-study': 'Case Study',
  infographic: 'Infographic',
  ebook: 'eBook',
  webinar: 'Webinar',
  audio: 'Audio / Podcast'
};
