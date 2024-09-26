export type TranslationContent = {
  tagline: string,
  description: string,
};

export type SEOContent = {
  title: string,
  description: string,
  keywords: string[],
  tagline?: string,
}

export interface PathSegment {
  slug_type: string;
  slug: string;
}



export type ProductHuntMetadata = {
  votesCount: number;
  commentCount: number;
  featuredAt: Date;
};

export type IndieHackersMetadata = {
  revenue: number;
  followers: number;
};

export type YCMetadata = {
  batch: string;
  team_size: number;
  launched_at: Date;
  status: string;
};

export type TaaftMetadata = {
  savesCount: number;
  commentsCount: number;
};

export type ProductMetadata = ProductHuntMetadata | IndieHackersMetadata | YCMetadata | TaaftMetadata;