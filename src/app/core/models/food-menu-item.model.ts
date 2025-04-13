import { CategoryDTO } from './category.model';
import { CurrencyDTO } from './currency.model';
import { Media } from './media.model';
import { Tax } from './tax.model';

export interface MenuItem {
  id: number;
  title: string; 
  description: string; 
  price: number; 
  tva: number; 
  imageUrl: URL; 
  salesCount: number;
  categories: CategoryDTO[];
  reviewCount: number;
  averageRating: number;
  barCode: string;
  currency: CurrencyDTO;
  tax: Tax;
  medias: Media[];
}



export interface PaginatedResponseDTO<T> {
  items: T[];
  totalCount: number;
}
