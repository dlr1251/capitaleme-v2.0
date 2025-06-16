export interface Review {
  authorName: string;
  rating: number;
  reviewDate: string;
  text: string;
  url: string;
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