export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beer_assessments: {
        Row: {
          aroma: number
          assessed_at: string
          balance: number
          beer_id: number
          bitterness: number
          body: number
          brightness: number
          distinctiveness: number
          editorial_verdict: string
          finish: number
          index_score: number | null
          methodology_note: string
          quality: number
          sweetness: number
          technical_execution: number
        }
        Insert: {
          aroma: number
          assessed_at: string
          balance: number
          beer_id: number
          bitterness: number
          body: number
          brightness: number
          distinctiveness: number
          editorial_verdict: string
          finish: number
          index_score?: number | null
          methodology_note: string
          quality: number
          sweetness: number
          technical_execution: number
        }
        Update: {
          aroma?: number
          assessed_at?: string
          balance?: number
          beer_id?: number
          bitterness?: number
          body?: number
          brightness?: number
          distinctiveness?: number
          editorial_verdict?: string
          finish?: number
          index_score?: number | null
          methodology_note?: string
          quality?: number
          sweetness?: number
          technical_execution?: number
        }
        Relationships: [
          {
            foreignKeyName: "beer_assessments_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: true
            referencedRelation: "beer_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_assessments_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: true
            referencedRelation: "beers"
            referencedColumns: ["id"]
          },
        ]
      }
      beer_descriptors: {
        Row: {
          beer_id: number
          descriptor_id: number
          intensity: number
        }
        Insert: {
          beer_id: number
          descriptor_id: number
          intensity: number
        }
        Update: {
          beer_id?: number
          descriptor_id?: number
          intensity?: number
        }
        Relationships: [
          {
            foreignKeyName: "beer_descriptors_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_descriptors_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: false
            referencedRelation: "beers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_descriptors_descriptor_id_fkey"
            columns: ["descriptor_id"]
            isOneToOne: false
            referencedRelation: "descriptors"
            referencedColumns: ["id"]
          },
        ]
      }
      beers: {
        Row: {
          abv: number | null
          brewery_id: number
          calories: number | null
          color_srm: number | null
          country_id: number
          created_at: string
          description: string
          final_gravity: number | null
          ibu: number | null
          id: number
          name: string
          original_gravity: number | null
          release_id: number
          slug: string
          style_id: number
        }
        Insert: {
          abv?: number | null
          brewery_id: number
          calories?: number | null
          color_srm?: number | null
          country_id: number
          created_at?: string
          description: string
          final_gravity?: number | null
          ibu?: number | null
          id?: never
          name: string
          original_gravity?: number | null
          release_id: number
          slug: string
          style_id: number
        }
        Update: {
          abv?: number | null
          brewery_id?: number
          calories?: number | null
          color_srm?: number | null
          country_id?: number
          created_at?: string
          description?: string
          final_gravity?: number | null
          ibu?: number | null
          id?: never
          name?: string
          original_gravity?: number | null
          release_id?: number
          slug?: string
          style_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "beers_brewery_id_fkey"
            columns: ["brewery_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["brewery_id"]
          },
          {
            foreignKeyName: "beers_brewery_id_fkey"
            columns: ["brewery_id"]
            isOneToOne: false
            referencedRelation: "breweries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "beers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country_summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beers_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "dataset_releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beers_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["style_id"]
          },
          {
            foreignKeyName: "beers_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "style_summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beers_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      breweries: {
        Row: {
          country_id: number
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          country_id: number
          created_at?: string
          id?: never
          name: string
          slug: string
        }
        Update: {
          country_id?: number
          created_at?: string
          id?: never
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "breweries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "breweries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breweries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string
          id: number
          iso_code: string
          name: string
          region: string
          slug: string
          summary: string
        }
        Insert: {
          created_at?: string
          id?: never
          iso_code: string
          name: string
          region: string
          slug: string
          summary: string
        }
        Update: {
          created_at?: string
          id?: never
          iso_code?: string
          name?: string
          region?: string
          slug?: string
          summary?: string
        }
        Relationships: []
      }
      dataset_releases: {
        Row: {
          audited_at: string
          created_at: string
          disclosure: string
          id: number
          is_demonstration: boolean
          slug: string
          title: string
        }
        Insert: {
          audited_at: string
          created_at?: string
          disclosure: string
          id?: never
          is_demonstration?: boolean
          slug: string
          title: string
        }
        Update: {
          audited_at?: string
          created_at?: string
          disclosure?: string
          id?: never
          is_demonstration?: boolean
          slug?: string
          title?: string
        }
        Relationships: []
      }
      descriptors: {
        Row: {
          category: string
          id: number
          name: string
        }
        Insert: {
          category: string
          id?: never
          name: string
        }
        Update: {
          category?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          beer_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          beer_id: number
          created_at?: string
          user_id: string
        }
        Update: {
          beer_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: false
            referencedRelation: "beer_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: false
            referencedRelation: "beers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          theme?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      styles: {
        Row: {
          created_at: string
          family: string
          id: number
          name: string
          related_style_slugs: string[]
          sensory_profile: Json
          slug: string
          summary: string
          typical_abv_max: number | null
          typical_abv_min: number | null
          typical_ibu_max: number | null
          typical_ibu_min: number | null
        }
        Insert: {
          created_at?: string
          family: string
          id?: never
          name: string
          related_style_slugs?: string[]
          sensory_profile?: Json
          slug: string
          summary: string
          typical_abv_max?: number | null
          typical_abv_min?: number | null
          typical_ibu_max?: number | null
          typical_ibu_min?: number | null
        }
        Update: {
          created_at?: string
          family?: string
          id?: never
          name?: string
          related_style_slugs?: string[]
          sensory_profile?: Json
          slug?: string
          summary?: string
          typical_abv_max?: number | null
          typical_abv_min?: number | null
          typical_ibu_max?: number | null
          typical_ibu_min?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      beer_catalog: {
        Row: {
          abv: number | null
          aroma: number | null
          assessed_at: string | null
          balance: number | null
          bitterness: number | null
          body: number | null
          brewery_id: number | null
          brewery_name: string | null
          brewery_slug: string | null
          brightness: number | null
          calories: number | null
          color_srm: number | null
          country_id: number | null
          country_name: string | null
          country_slug: string | null
          description: string | null
          distinctiveness: number | null
          editorial_verdict: string | null
          final_gravity: number | null
          finish: number | null
          global_rank: number | null
          ibu: number | null
          id: number | null
          index_score: number | null
          iso_code: string | null
          methodology_note: string | null
          name: string | null
          original_gravity: number | null
          quality: number | null
          region: string | null
          slug: string | null
          style_family: string | null
          style_id: number | null
          style_name: string | null
          style_slug: string | null
          sweetness: number | null
          technical_execution: number | null
        }
        Relationships: []
      }
      country_summaries: {
        Row: {
          average_score: number | null
          beer_count: number | null
          brewery_count: number | null
          id: number | null
          iso_code: string | null
          leading_beer_name: string | null
          leading_beer_slug: string | null
          name: string | null
          region: string | null
          slug: string | null
          summary: string | null
        }
        Relationships: []
      }
      style_summaries: {
        Row: {
          average_score: number | null
          beer_count: number | null
          family: string | null
          id: number | null
          leading_beer_name: string | null
          leading_beer_slug: string | null
          name: string | null
          related_style_slugs: string[] | null
          sensory_profile: Json | null
          slug: string | null
          summary: string | null
          typical_abv_max: number | null
          typical_abv_min: number | null
          typical_ibu_max: number | null
          typical_ibu_min: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

type NonNullableViewFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}

type GeneratedBeerCatalogRow = Database["public"]["Views"]["beer_catalog"]["Row"]

/**
 * The generator conservatively marks every view field nullable. This view is
 * built entirely from inner joins over non-null assessment and identity fields,
 * so those fields are guaranteed by the SQL view contract.
 */
export type BeerCatalogRow = NonNullableViewFields<
  GeneratedBeerCatalogRow,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "brewery_id"
  | "brewery_name"
  | "brewery_slug"
  | "country_id"
  | "country_name"
  | "country_slug"
  | "iso_code"
  | "region"
  | "style_id"
  | "style_name"
  | "style_slug"
  | "style_family"
  | "index_score"
  | "quality"
  | "balance"
  | "distinctiveness"
  | "technical_execution"
  | "aroma"
  | "bitterness"
  | "sweetness"
  | "body"
  | "brightness"
  | "finish"
  | "editorial_verdict"
  | "methodology_note"
  | "assessed_at"
  | "global_rank"
>

export type CountrySummaryRow = NonNullableViewFields<
  Database["public"]["Views"]["country_summaries"]["Row"],
  "id" | "name" | "slug" | "iso_code" | "region" | "summary" | "beer_count" | "brewery_count"
>

export type StyleSummaryRow = NonNullableViewFields<
  Database["public"]["Views"]["style_summaries"]["Row"],
  "id" | "name" | "slug" | "family" | "summary" | "beer_count" | "sensory_profile" | "related_style_slugs"
>
