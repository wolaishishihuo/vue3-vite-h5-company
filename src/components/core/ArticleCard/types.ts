export interface ArticleInfo {
  id: string | number;
  title: string;
  summary: string;
  publishTime: string;
  images?: string[];
  status?: {
    text: string;
    type: 'pending' | 'processed' | 'default';
  };
}

export type ArticleDisplayMode = 'text' | 'single-image' | 'multi-image';

export interface ArticleCardProps {
  article: ArticleInfo;
  mode?: ArticleDisplayMode;
  clickable?: boolean;
}
