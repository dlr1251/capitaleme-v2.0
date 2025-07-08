export interface Review {
  authorName: string;
  rating: number;
  reviewDate: string;
  text: string;
  url: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  image: string;
  bio: string;
  fullBio: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Visa {
  id: string;
  data: {
    title: string;
    description: string;
    popular?: boolean;
    requirements?: string[];
    process?: string[];
    documents?: string[];
  };
}

export interface RealEstateProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'land';
  features: string[];
  images: string[];
}

// Re-export unified Notion types from notionTypes
export type {
  NotionPage,
  NotionBlock,
  NotionProperty,
  NotionRichText,
  NotionTitleProperty,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionCheckboxProperty,
  NotionDateProperty,
  NotionFilesProperty,
  ParagraphBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  BulletedListItemBlock,
  NumberedListItemBlock,
  ToDoBlock,
  ToggleBlock,
  QuoteBlock,
  CalloutBlock,
  CodeBlock,
  ImageBlock,
  VideoBlock
} from '../utils/notionTypes.js';

// Legacy types for backward compatibility (deprecated)
export interface NotionDatabaseResponse {
  results: import('../utils/notionTypes.js').NotionPage[];
  next_cursor?: string;
  has_more: boolean;
}

export interface NotionPageResponse {
  object: 'page';
  id: string;
  url: string;
  properties: any;
  last_edited_time: string;
  created_time: string;
}

// Team member types for components
export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string | null;
  order?: number;
  phone?: string;
}

// Property types for real estate
export interface PropertyImage {
  url: string;
  alt: string;
  description?: string;
}

export interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: {
    usd: number;
    cop: number;
  };
  location: string;
  area: {
    total: number;
    unit: string;
  };
  status: 'available' | 'sold' | 'pending';
  images: PropertyImage[];
  features?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  // Additional properties for PropertyCard compatibility
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  hoaFee?: number;
  cadastralAppraisal?: number;
  propertyTax?: number;
} 