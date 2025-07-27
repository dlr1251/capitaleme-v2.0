import * as React from 'react';

export interface PropertyImage {
  url: string;
  alt: string;
  description?: string;
}

export interface PropertyGalleryProps {
  images?: PropertyImage[];
}

declare const PropertyGallery: React.FC<PropertyGalleryProps>;
export default PropertyGallery; 