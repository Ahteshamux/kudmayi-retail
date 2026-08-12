import type { CategorySlug } from "./categories";

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  color: string;
  image_url: string | null;
  available: boolean;
  created_at: string;
};
