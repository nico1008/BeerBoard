export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationship[];
};

type ViewDefinition<Row> = {
  Row: Row;
  Relationships: Relationship[];
};

export type BeerCatalogRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  abv: number | null;
  ibu: number | null;
  calories: number | null;
  original_gravity: number | null;
  final_gravity: number | null;
  color_srm: number | null;
  brewery_id: number;
  brewery_name: string;
  brewery_slug: string;
  country_id: number;
  country_name: string;
  country_slug: string;
  iso_code: string;
  region: string;
  style_id: number;
  style_name: string;
  style_slug: string;
  style_family: string;
  index_score: number;
  quality: number;
  balance: number;
  distinctiveness: number;
  technical_execution: number;
  aroma: number;
  bitterness: number;
  sweetness: number;
  body: number;
  brightness: number;
  finish: number;
  editorial_verdict: string;
  methodology_note: string;
  assessed_at: string;
  global_rank: number;
};

export type CountrySummaryRow = {
  id: number;
  name: string;
  slug: string;
  iso_code: string;
  region: string;
  summary: string;
  beer_count: number;
  brewery_count: number;
  average_score: number | null;
  leading_beer_name: string | null;
  leading_beer_slug: string | null;
};

export type StyleSummaryRow = {
  id: number;
  name: string;
  slug: string;
  family: string;
  summary: string;
  typical_abv_min: number | null;
  typical_abv_max: number | null;
  typical_ibu_min: number | null;
  typical_ibu_max: number | null;
  sensory_profile: Json;
  related_style_slugs: string[];
  beer_count: number;
  average_score: number | null;
  leading_beer_name: string | null;
  leading_beer_slug: string | null;
};

export type Database = {
  public: {
    Tables: {
      dataset_releases: TableDefinition<
        { id: number; slug: string; title: string; audited_at: string; is_demonstration: boolean; disclosure: string; created_at: string },
        { id?: number; slug: string; title: string; audited_at: string; is_demonstration?: boolean; disclosure: string; created_at?: string },
        { slug?: string; title?: string; audited_at?: string; is_demonstration?: boolean; disclosure?: string }
      >;
      countries: TableDefinition<
        { id: number; name: string; slug: string; iso_code: string; region: string; summary: string; created_at: string },
        { id?: number; name: string; slug: string; iso_code: string; region: string; summary: string; created_at?: string },
        { name?: string; slug?: string; iso_code?: string; region?: string; summary?: string }
      >;
      styles: TableDefinition<
        { id: number; name: string; slug: string; family: string; summary: string; typical_abv_min: number | null; typical_abv_max: number | null; typical_ibu_min: number | null; typical_ibu_max: number | null; sensory_profile: Json; related_style_slugs: string[]; created_at: string },
        { id?: number; name: string; slug: string; family: string; summary: string; typical_abv_min?: number | null; typical_abv_max?: number | null; typical_ibu_min?: number | null; typical_ibu_max?: number | null; sensory_profile?: Json; related_style_slugs?: string[]; created_at?: string },
        { name?: string; summary?: string; sensory_profile?: Json; related_style_slugs?: string[] }
      >;
      breweries: TableDefinition<
        { id: number; country_id: number; name: string; slug: string; created_at: string },
        { id?: number; country_id: number; name: string; slug: string; created_at?: string },
        { country_id?: number; name?: string; slug?: string }
      >;
      beers: TableDefinition<
        { id: number; release_id: number; brewery_id: number; country_id: number; style_id: number; name: string; slug: string; description: string; abv: number | null; ibu: number | null; calories: number | null; original_gravity: number | null; final_gravity: number | null; color_srm: number | null; created_at: string },
        { id?: number; release_id: number; brewery_id: number; country_id: number; style_id: number; name: string; slug: string; description: string; abv?: number | null; ibu?: number | null; calories?: number | null; original_gravity?: number | null; final_gravity?: number | null; color_srm?: number | null; created_at?: string },
        { name?: string; description?: string; abv?: number | null; ibu?: number | null }
      >;
      beer_assessments: TableDefinition<
        { beer_id: number; quality: number; balance: number; distinctiveness: number; technical_execution: number; aroma: number; bitterness: number; sweetness: number; body: number; brightness: number; finish: number; editorial_verdict: string; methodology_note: string; assessed_at: string; index_score: number },
        { beer_id: number; quality: number; balance: number; distinctiveness: number; technical_execution: number; aroma: number; bitterness: number; sweetness: number; body: number; brightness: number; finish: number; editorial_verdict: string; methodology_note: string; assessed_at: string },
        { quality?: number; balance?: number; distinctiveness?: number; technical_execution?: number; editorial_verdict?: string }
      >;
      descriptors: TableDefinition<
        { id: number; name: string; category: string },
        { id?: number; name: string; category: string },
        { name?: string; category?: string }
      >;
      beer_descriptors: TableDefinition<
        { beer_id: number; descriptor_id: number; intensity: number },
        { beer_id: number; descriptor_id: number; intensity: number },
        { intensity?: number }
      >;
      profiles: TableDefinition<
        { id: string; display_name: string; theme: string; created_at: string; updated_at: string },
        { id: string; display_name: string; theme?: string; created_at?: string; updated_at?: string },
        { display_name?: string; theme?: string; updated_at?: string }
      >;
      ledger_entries: TableDefinition<
        { user_id: string; beer_id: number; created_at: string },
        { user_id: string; beer_id: number; created_at?: string },
        { user_id?: string; beer_id?: number }
      >;
    };
    Views: {
      beer_catalog: ViewDefinition<BeerCatalogRow>;
      country_summaries: ViewDefinition<CountrySummaryRow>;
      style_summaries: ViewDefinition<StyleSummaryRow>;
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
