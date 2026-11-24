export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      _backup_reviews_duplicadas_20261015: {
        Row: {
          backed_up_at: string;
          review_table: string;
          row_data: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          backed_up_at?: string;
          review_table: string;
          row_data: NonNullable<Json>;
        };
        Update: {
          backed_up_at?: string;
          review_table?: string;
          row_data?: NonNullable<Json>;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          key_set: string;
          updated_at_set: string;
          value_set: Json | null;
        };
        ComputedFields: never;
        Insert: {
          key_set: string;
          updated_at_set?: string;
          value_set?: Json | null;
        };
        Update: {
          key_set?: string;
          updated_at_set?: string;
          value_set?: Json | null;
        };
        Relationships: [];
      };
      attraction_category_map: {
        Row: {
          attraction_id_acm: string;
          category_id_acm: string;
        };
        ComputedFields: never;
        Insert: {
          attraction_id_acm: string;
          category_id_acm: string;
        };
        Update: {
          attraction_id_acm?: string;
          category_id_acm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attraction_category_map_attraction_id_acm_fkey';
            columns: ['attraction_id_acm'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_category_map_category_id_acm_fkey';
            columns: ['category_id_acm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      attraction_images: {
        Row: {
          attraction_id_aim: string;
          created_at_aim: string | null;
          id_aim: string;
          path_aim: string;
          sort_order_aim: number | null;
        };
        ComputedFields: never;
        Insert: {
          attraction_id_aim: string;
          created_at_aim?: string | null;
          id_aim?: string;
          path_aim: string;
          sort_order_aim?: number | null;
        };
        Update: {
          attraction_id_aim?: string;
          created_at_aim?: string | null;
          id_aim?: string;
          path_aim?: string;
          sort_order_aim?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attraction_images_attraction_id_fkey';
            columns: ['attraction_id_aim'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
        ];
      };
      attraction_likes: {
        Row: {
          attraction_id_alk: string;
          created_at_alk: string;
          user_id_alk: string;
        };
        ComputedFields: never;
        Insert: {
          attraction_id_alk: string;
          created_at_alk?: string;
          user_id_alk: string;
        };
        Update: {
          attraction_id_alk?: string;
          created_at_alk?: string;
          user_id_alk?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attraction_likes_attraction_id_fkey';
            columns: ['attraction_id_alk'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_likes_user_id_fkey';
            columns: ['user_id_alk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_review_likes: {
        Row: {
          created_at_arl: string;
          review_id_arl: string;
          user_id_arl: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_arl?: string;
          review_id_arl: string;
          user_id_arl: string;
        };
        Update: {
          created_at_arl?: string;
          review_id_arl?: string;
          user_id_arl?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attraction_review_likes_review_id_fkey';
            columns: ['review_id_arl'];
            isOneToOne: false;
            referencedRelation: 'attraction_reviews';
            referencedColumns: ['id_arv'];
          },
          {
            foreignKeyName: 'attraction_review_likes_user_id_fkey';
            columns: ['user_id_arl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_reviews: {
        Row: {
          attraction_id_arv: string | null;
          comment_arv: string | null;
          created_at_arv: string | null;
          id_arv: string;
          moderated_at_arv: string | null;
          rating_arv: number | null;
          user_id_arv: string | null;
        };
        ComputedFields: never;
        Insert: {
          attraction_id_arv?: string | null;
          comment_arv?: string | null;
          created_at_arv?: string | null;
          id_arv?: string;
          moderated_at_arv?: string | null;
          rating_arv?: number | null;
          user_id_arv?: string | null;
        };
        Update: {
          attraction_id_arv?: string | null;
          comment_arv?: string | null;
          created_at_arv?: string | null;
          id_arv?: string;
          moderated_at_arv?: string | null;
          rating_arv?: number | null;
          user_id_arv?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attraction_reviews_attraction_id_arv_fkey';
            columns: ['attraction_id_arv'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_reviews_user_id_arv_fkey';
            columns: ['user_id_arv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attractions: {
        Row: {
          avg_rating_atr: number | null;
          created_at_atr: string | null;
          description_atr: string | null;
          id_atr: string;
          is_active_atr: boolean | null;
          is_blocked_atr: boolean;
          location_id_atr: string | null;
          moderation_note_atr: string | null;
          moderation_status_atr: Database['public']['Enums']['moderation_status'] | null;
          name_atr: string | null;
          reviewed_at_atr: string | null;
          reviewed_by_atr: string | null;
          reviews_count_atr: number | null;
          submitted_by_atr: string | null;
          updated_at_atr: string | null;
        };
        ComputedFields: never;
        Insert: {
          avg_rating_atr?: number | null;
          created_at_atr?: string | null;
          description_atr?: string | null;
          id_atr?: string;
          is_active_atr?: boolean | null;
          is_blocked_atr?: boolean;
          location_id_atr?: string | null;
          moderation_note_atr?: string | null;
          moderation_status_atr?: Database['public']['Enums']['moderation_status'] | null;
          name_atr?: string | null;
          reviewed_at_atr?: string | null;
          reviewed_by_atr?: string | null;
          reviews_count_atr?: number | null;
          submitted_by_atr?: string | null;
          updated_at_atr?: string | null;
        };
        Update: {
          avg_rating_atr?: number | null;
          created_at_atr?: string | null;
          description_atr?: string | null;
          id_atr?: string;
          is_active_atr?: boolean | null;
          is_blocked_atr?: boolean;
          location_id_atr?: string | null;
          moderation_note_atr?: string | null;
          moderation_status_atr?: Database['public']['Enums']['moderation_status'] | null;
          name_atr?: string | null;
          reviewed_at_atr?: string | null;
          reviewed_by_atr?: string | null;
          reviews_count_atr?: number | null;
          submitted_by_atr?: string | null;
          updated_at_atr?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attractions_location_id_atr_fkey';
            columns: ['location_id_atr'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'attractions_reviewed_by_atr_fkey';
            columns: ['reviewed_by_atr'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'attractions_submitted_by_atr_fkey';
            columns: ['submitted_by_atr'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_category_map: {
        Row: {
          business_id_bcm: string;
          category_id_bcm: string;
        };
        ComputedFields: never;
        Insert: {
          business_id_bcm: string;
          category_id_bcm: string;
        };
        Update: {
          business_id_bcm?: string;
          category_id_bcm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_category_map_business_id_bcm_fkey';
            columns: ['business_id_bcm'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_category_map_category_id_bcm_fkey';
            columns: ['category_id_bcm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      business_contact_clicks: {
        Row: {
          business_id_bcc: string;
          contact_type_bcc: string;
          created_at_bcc: string;
          id_bcc: string;
          user_id_bcc: string | null;
        };
        ComputedFields: never;
        Insert: {
          business_id_bcc: string;
          contact_type_bcc: string;
          created_at_bcc?: string;
          id_bcc?: string;
          user_id_bcc?: string | null;
        };
        Update: {
          business_id_bcc?: string;
          contact_type_bcc?: string;
          created_at_bcc?: string;
          id_bcc?: string;
          user_id_bcc?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_contact_clicks_business_id_fkey';
            columns: ['business_id_bcc'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
        ];
      };
      business_images: {
        Row: {
          business_id_bim: string;
          created_at_bim: string | null;
          id_bim: string;
          path_bim: string;
          sort_order_bim: number | null;
        };
        ComputedFields: never;
        Insert: {
          business_id_bim: string;
          created_at_bim?: string | null;
          id_bim?: string;
          path_bim: string;
          sort_order_bim?: number | null;
        };
        Update: {
          business_id_bim?: string;
          created_at_bim?: string | null;
          id_bim?: string;
          path_bim?: string;
          sort_order_bim?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_images_business_id_fkey';
            columns: ['business_id_bim'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
        ];
      };
      business_likes: {
        Row: {
          business_id_blk: string;
          created_at_blk: string;
          user_id_blk: string;
        };
        ComputedFields: never;
        Insert: {
          business_id_blk: string;
          created_at_blk?: string;
          user_id_blk: string;
        };
        Update: {
          business_id_blk?: string;
          created_at_blk?: string;
          user_id_blk?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_likes_business_id_fkey';
            columns: ['business_id_blk'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_likes_user_id_fkey';
            columns: ['user_id_blk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_review_likes: {
        Row: {
          created_at_brl: string;
          review_id_brl: string;
          user_id_brl: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_brl?: string;
          review_id_brl: string;
          user_id_brl: string;
        };
        Update: {
          created_at_brl?: string;
          review_id_brl?: string;
          user_id_brl?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_review_likes_review_id_fkey';
            columns: ['review_id_brl'];
            isOneToOne: false;
            referencedRelation: 'business_reviews';
            referencedColumns: ['id_brv'];
          },
          {
            foreignKeyName: 'business_review_likes_user_id_fkey';
            columns: ['user_id_brl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_reviews: {
        Row: {
          business_id_brv: string | null;
          comment_brv: string | null;
          created_at_brv: string | null;
          id_brv: string;
          moderated_at_brv: string | null;
          rating_brv: number | null;
          user_id_brv: string | null;
        };
        ComputedFields: never;
        Insert: {
          business_id_brv?: string | null;
          comment_brv?: string | null;
          created_at_brv?: string | null;
          id_brv?: string;
          moderated_at_brv?: string | null;
          rating_brv?: number | null;
          user_id_brv?: string | null;
        };
        Update: {
          business_id_brv?: string | null;
          comment_brv?: string | null;
          created_at_brv?: string | null;
          id_brv?: string;
          moderated_at_brv?: string | null;
          rating_brv?: number | null;
          user_id_brv?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_reviews_business_id_brv_fkey';
            columns: ['business_id_brv'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_reviews_user_id_brv_fkey';
            columns: ['user_id_brv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      businesses: {
        Row: {
          avg_rating_bus: number | null;
          contact_email_bus: string | null;
          contact_phone_bus: string | null;
          created_at_bus: string | null;
          description_bus: string | null;
          id_bus: string;
          is_active_bus: boolean | null;
          is_blocked_bus: boolean;
          location_id_bus: string | null;
          moderation_note_bus: string | null;
          moderation_status_bus: Database['public']['Enums']['moderation_status'] | null;
          name_bus: string | null;
          owner_id_bus: string | null;
          reviewed_at_bus: string | null;
          reviewed_by_bus: string | null;
          reviews_count_bus: number | null;
          social_links_bus: Json | null;
          updated_at_bus: string | null;
          website_bus: string | null;
        };
        ComputedFields: never;
        Insert: {
          avg_rating_bus?: number | null;
          contact_email_bus?: string | null;
          contact_phone_bus?: string | null;
          created_at_bus?: string | null;
          description_bus?: string | null;
          id_bus?: string;
          is_active_bus?: boolean | null;
          is_blocked_bus?: boolean;
          location_id_bus?: string | null;
          moderation_note_bus?: string | null;
          moderation_status_bus?: Database['public']['Enums']['moderation_status'] | null;
          name_bus?: string | null;
          owner_id_bus?: string | null;
          reviewed_at_bus?: string | null;
          reviewed_by_bus?: string | null;
          reviews_count_bus?: number | null;
          social_links_bus?: Json | null;
          updated_at_bus?: string | null;
          website_bus?: string | null;
        };
        Update: {
          avg_rating_bus?: number | null;
          contact_email_bus?: string | null;
          contact_phone_bus?: string | null;
          created_at_bus?: string | null;
          description_bus?: string | null;
          id_bus?: string;
          is_active_bus?: boolean | null;
          is_blocked_bus?: boolean;
          location_id_bus?: string | null;
          moderation_note_bus?: string | null;
          moderation_status_bus?: Database['public']['Enums']['moderation_status'] | null;
          name_bus?: string | null;
          owner_id_bus?: string | null;
          reviewed_at_bus?: string | null;
          reviewed_by_bus?: string | null;
          reviews_count_bus?: number | null;
          social_links_bus?: Json | null;
          updated_at_bus?: string | null;
          website_bus?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'businesses_location_id_bus_fkey';
            columns: ['location_id_bus'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'businesses_owner_id_bus_fkey';
            columns: ['owner_id_bus'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'businesses_reviewed_by_bus_fkey';
            columns: ['reviewed_by_bus'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      cantons: {
        Row: {
          created_at_ctn: string | null;
          id_ctn: string;
          name_ctn: string;
          province_id_ctn: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_ctn?: string | null;
          id_ctn?: string;
          name_ctn: string;
          province_id_ctn: string;
        };
        Update: {
          created_at_ctn?: string | null;
          id_ctn?: string;
          name_ctn?: string;
          province_id_ctn?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cantons_province_id_fkey';
            columns: ['province_id_ctn'];
            isOneToOne: false;
            referencedRelation: 'provinces';
            referencedColumns: ['id_prv'];
          },
        ];
      };
      categories: {
        Row: {
          created_at_cat: string | null;
          id_cat: string;
          is_active_cat: boolean | null;
          name_cat: string | null;
          parent_id_cat: string | null;
          sort_order_cat: number | null;
        };
        ComputedFields: never;
        Insert: {
          created_at_cat?: string | null;
          id_cat?: string;
          is_active_cat?: boolean | null;
          name_cat?: string | null;
          parent_id_cat?: string | null;
          sort_order_cat?: number | null;
        };
        Update: {
          created_at_cat?: string | null;
          id_cat?: string;
          is_active_cat?: boolean | null;
          name_cat?: string | null;
          parent_id_cat?: string | null;
          sort_order_cat?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id_cat'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      content_reports: {
        Row: {
          created_at_rep: string;
          details_rep: string | null;
          entity_id_rep: string;
          entity_type_rep: string;
          id_rep: string;
          reason_rep: string;
          reporter_id_rep: string;
          reviewed_at_rep: string | null;
          reviewed_by_rep: string | null;
          status_rep: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_rep?: string;
          details_rep?: string | null;
          entity_id_rep: string;
          entity_type_rep: string;
          id_rep?: string;
          reason_rep: string;
          reporter_id_rep?: string;
          reviewed_at_rep?: string | null;
          reviewed_by_rep?: string | null;
          status_rep?: string;
        };
        Update: {
          created_at_rep?: string;
          details_rep?: string | null;
          entity_id_rep?: string;
          entity_type_rep?: string;
          id_rep?: string;
          reason_rep?: string;
          reporter_id_rep?: string;
          reviewed_at_rep?: string | null;
          reviewed_by_rep?: string | null;
          status_rep?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'content_reports_reporter_id_rep_fkey';
            columns: ['reporter_id_rep'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'content_reports_reviewed_by_rep_fkey';
            columns: ['reviewed_by_rep'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      countries: {
        Row: {
          created_at_cnt: string | null;
          id_cnt: string;
          name_cnt: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_cnt?: string | null;
          id_cnt?: string;
          name_cnt: string;
        };
        Update: {
          created_at_cnt?: string | null;
          id_cnt?: string;
          name_cnt?: string;
        };
        Relationships: [];
      };
      districts: {
        Row: {
          canton_id_dst: string;
          created_at_dst: string | null;
          id_dst: string;
          name_dst: string;
        };
        ComputedFields: never;
        Insert: {
          canton_id_dst: string;
          created_at_dst?: string | null;
          id_dst?: string;
          name_dst: string;
        };
        Update: {
          canton_id_dst?: string;
          created_at_dst?: string | null;
          id_dst?: string;
          name_dst?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'districts_canton_id_fkey';
            columns: ['canton_id_dst'];
            isOneToOne: false;
            referencedRelation: 'cantons';
            referencedColumns: ['id_ctn'];
          },
        ];
      };
      event_category_map: {
        Row: {
          category_id_ecm: string;
          event_id_ecm: string;
        };
        ComputedFields: never;
        Insert: {
          category_id_ecm: string;
          event_id_ecm: string;
        };
        Update: {
          category_id_ecm?: string;
          event_id_ecm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_category_map_category_id_ecm_fkey';
            columns: ['category_id_ecm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
          {
            foreignKeyName: 'event_category_map_event_id_ecm_fkey';
            columns: ['event_id_ecm'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
        ];
      };
      event_images: {
        Row: {
          created_at_eim: string | null;
          event_id_eim: string;
          id_eim: string;
          path_eim: string;
          sort_order_eim: number | null;
        };
        ComputedFields: never;
        Insert: {
          created_at_eim?: string | null;
          event_id_eim: string;
          id_eim?: string;
          path_eim: string;
          sort_order_eim?: number | null;
        };
        Update: {
          created_at_eim?: string | null;
          event_id_eim?: string;
          id_eim?: string;
          path_eim?: string;
          sort_order_eim?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_images_event_id_fkey';
            columns: ['event_id_eim'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
        ];
      };
      event_likes: {
        Row: {
          created_at_elk: string;
          event_id_elk: string;
          user_id_elk: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_elk?: string;
          event_id_elk: string;
          user_id_elk: string;
        };
        Update: {
          created_at_elk?: string;
          event_id_elk?: string;
          user_id_elk?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_likes_event_id_fkey';
            columns: ['event_id_elk'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_likes_user_id_fkey';
            columns: ['user_id_elk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_review_likes: {
        Row: {
          created_at_erl: string;
          review_id_erl: string;
          user_id_erl: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_erl?: string;
          review_id_erl: string;
          user_id_erl: string;
        };
        Update: {
          created_at_erl?: string;
          review_id_erl?: string;
          user_id_erl?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_review_likes_review_id_fkey';
            columns: ['review_id_erl'];
            isOneToOne: false;
            referencedRelation: 'event_reviews';
            referencedColumns: ['id_erv'];
          },
          {
            foreignKeyName: 'event_review_likes_user_id_fkey';
            columns: ['user_id_erl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_reviews: {
        Row: {
          comment_erv: string | null;
          created_at_erv: string | null;
          event_id_erv: string | null;
          id_erv: string;
          moderated_at_erv: string | null;
          rating_erv: number | null;
          user_id_erv: string | null;
        };
        ComputedFields: never;
        Insert: {
          comment_erv?: string | null;
          created_at_erv?: string | null;
          event_id_erv?: string | null;
          id_erv?: string;
          moderated_at_erv?: string | null;
          rating_erv?: number | null;
          user_id_erv?: string | null;
        };
        Update: {
          comment_erv?: string | null;
          created_at_erv?: string | null;
          event_id_erv?: string | null;
          id_erv?: string;
          moderated_at_erv?: string | null;
          rating_erv?: number | null;
          user_id_erv?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_reviews_event_id_erv_fkey';
            columns: ['event_id_erv'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_reviews_user_id_erv_fkey';
            columns: ['user_id_erv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      events: {
        Row: {
          avg_rating_evt: number | null;
          capacity_evt: number | null;
          contact_email_evt: string | null;
          contact_phone_evt: string | null;
          created_at_evt: string | null;
          created_by_evt: string | null;
          currency_evt: string | null;
          description_evt: string | null;
          end_at_evt: string | null;
          id_evt: string;
          is_active_evt: boolean | null;
          is_blocked_evt: boolean;
          is_free_evt: boolean | null;
          location_id_evt: string | null;
          moderation_note_evt: string | null;
          moderation_status_evt: Database['public']['Enums']['moderation_status'] | null;
          name_evt: string | null;
          price_evt: number | null;
          reviewed_at_evt: string | null;
          reviewed_by_evt: string | null;
          reviews_count_evt: number | null;
          social_links_evt: Json | null;
          start_at_evt: string | null;
          ticket_url_evt: string | null;
          updated_at_evt: string | null;
          website_evt: string | null;
        };
        ComputedFields: never;
        Insert: {
          avg_rating_evt?: number | null;
          capacity_evt?: number | null;
          contact_email_evt?: string | null;
          contact_phone_evt?: string | null;
          created_at_evt?: string | null;
          created_by_evt?: string | null;
          currency_evt?: string | null;
          description_evt?: string | null;
          end_at_evt?: string | null;
          id_evt?: string;
          is_active_evt?: boolean | null;
          is_blocked_evt?: boolean;
          is_free_evt?: boolean | null;
          location_id_evt?: string | null;
          moderation_note_evt?: string | null;
          moderation_status_evt?: Database['public']['Enums']['moderation_status'] | null;
          name_evt?: string | null;
          price_evt?: number | null;
          reviewed_at_evt?: string | null;
          reviewed_by_evt?: string | null;
          reviews_count_evt?: number | null;
          social_links_evt?: Json | null;
          start_at_evt?: string | null;
          ticket_url_evt?: string | null;
          updated_at_evt?: string | null;
          website_evt?: string | null;
        };
        Update: {
          avg_rating_evt?: number | null;
          capacity_evt?: number | null;
          contact_email_evt?: string | null;
          contact_phone_evt?: string | null;
          created_at_evt?: string | null;
          created_by_evt?: string | null;
          currency_evt?: string | null;
          description_evt?: string | null;
          end_at_evt?: string | null;
          id_evt?: string;
          is_active_evt?: boolean | null;
          is_blocked_evt?: boolean;
          is_free_evt?: boolean | null;
          location_id_evt?: string | null;
          moderation_note_evt?: string | null;
          moderation_status_evt?: Database['public']['Enums']['moderation_status'] | null;
          name_evt?: string | null;
          price_evt?: number | null;
          reviewed_at_evt?: string | null;
          reviewed_by_evt?: string | null;
          reviews_count_evt?: number | null;
          social_links_evt?: Json | null;
          start_at_evt?: string | null;
          ticket_url_evt?: string | null;
          updated_at_evt?: string | null;
          website_evt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'events_created_by_evt_fkey';
            columns: ['created_by_evt'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'events_location_id_evt_fkey';
            columns: ['location_id_evt'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'events_reviewed_by_evt_fkey';
            columns: ['reviewed_by_evt'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      locations: {
        Row: {
          address_loc: string | null;
          created_at_loc: string | null;
          district_id_loc: string;
          id_loc: string;
          latitude_loc: number | null;
          longitude_loc: number | null;
        };
        ComputedFields: never;
        Insert: {
          address_loc?: string | null;
          created_at_loc?: string | null;
          district_id_loc: string;
          id_loc?: string;
          latitude_loc?: number | null;
          longitude_loc?: number | null;
        };
        Update: {
          address_loc?: string | null;
          created_at_loc?: string | null;
          district_id_loc?: string;
          id_loc?: string;
          latitude_loc?: number | null;
          longitude_loc?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'locations_district_id_fkey';
            columns: ['district_id_loc'];
            isOneToOne: false;
            referencedRelation: 'districts';
            referencedColumns: ['id_dst'];
          },
        ];
      };
      product_category_map: {
        Row: {
          category_id_pcm: string;
          product_id_pcm: string;
        };
        ComputedFields: never;
        Insert: {
          category_id_pcm: string;
          product_id_pcm: string;
        };
        Update: {
          category_id_pcm?: string;
          product_id_pcm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_category_map_category_id_pcm_fkey';
            columns: ['category_id_pcm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
          {
            foreignKeyName: 'product_category_map_product_id_pcm_fkey';
            columns: ['product_id_pcm'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
        ];
      };
      product_images: {
        Row: {
          created_at_pim: string | null;
          id_pim: string;
          path_pim: string;
          product_id_pim: string;
          sort_order_pim: number | null;
        };
        ComputedFields: never;
        Insert: {
          created_at_pim?: string | null;
          id_pim?: string;
          path_pim: string;
          product_id_pim: string;
          sort_order_pim?: number | null;
        };
        Update: {
          created_at_pim?: string | null;
          id_pim?: string;
          path_pim?: string;
          product_id_pim?: string;
          sort_order_pim?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id_pim'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
        ];
      };
      product_reviews: {
        Row: {
          comment_prv: string | null;
          created_at_prv: string | null;
          id_prv: string;
          moderated_at_prv: string | null;
          product_id_prv: string | null;
          rating_prv: number | null;
          user_id_prv: string | null;
        };
        ComputedFields: never;
        Insert: {
          comment_prv?: string | null;
          created_at_prv?: string | null;
          id_prv?: string;
          moderated_at_prv?: string | null;
          product_id_prv?: string | null;
          rating_prv?: number | null;
          user_id_prv?: string | null;
        };
        Update: {
          comment_prv?: string | null;
          created_at_prv?: string | null;
          id_prv?: string;
          moderated_at_prv?: string | null;
          product_id_prv?: string | null;
          rating_prv?: number | null;
          user_id_prv?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_reviews_product_id_prv_fkey';
            columns: ['product_id_prv'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
          {
            foreignKeyName: 'product_reviews_user_id_prv_fkey';
            columns: ['user_id_prv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      products: {
        Row: {
          avg_rating_prd: number | null;
          business_id_prd: string | null;
          created_at_prd: string | null;
          currency_prd: string | null;
          description_prd: string | null;
          id_prd: string;
          is_active_prd: boolean | null;
          is_blocked_prd: boolean;
          name_prd: string | null;
          price_prd: number | null;
          reviews_count_prd: number | null;
          updated_at_prd: string | null;
        };
        ComputedFields: never;
        Insert: {
          avg_rating_prd?: number | null;
          business_id_prd?: string | null;
          created_at_prd?: string | null;
          currency_prd?: string | null;
          description_prd?: string | null;
          id_prd?: string;
          is_active_prd?: boolean | null;
          is_blocked_prd?: boolean;
          name_prd?: string | null;
          price_prd?: number | null;
          reviews_count_prd?: number | null;
          updated_at_prd?: string | null;
        };
        Update: {
          avg_rating_prd?: number | null;
          business_id_prd?: string | null;
          created_at_prd?: string | null;
          currency_prd?: string | null;
          description_prd?: string | null;
          id_prd?: string;
          is_active_prd?: boolean | null;
          is_blocked_prd?: boolean;
          name_prd?: string | null;
          price_prd?: number | null;
          reviews_count_prd?: number | null;
          updated_at_prd?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_business_id_prd_fkey';
            columns: ['business_id_prd'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
        ];
      };
      profile_subscriptions: {
        Row: {
          approved_at_psub: string | null;
          approved_by_psub: string | null;
          cancelled_at_psub: string | null;
          created_at_psub: string;
          expires_at_psub: string | null;
          id_psub: string;
          payment_note_psub: string | null;
          payment_reference_psub: string;
          profile_id_psub: string;
          rejected_at_psub: string | null;
          rejected_by_psub: string | null;
          rejection_reason_psub: string | null;
          status_psub: Database['public']['Enums']['subscription_status'];
          subscribed_at_psub: string;
          subscription_id_psub: string;
          updated_at_psub: string;
        };
        ComputedFields: never;
        Insert: {
          approved_at_psub?: string | null;
          approved_by_psub?: string | null;
          cancelled_at_psub?: string | null;
          created_at_psub?: string;
          expires_at_psub?: string | null;
          id_psub?: string;
          payment_note_psub?: string | null;
          payment_reference_psub: string;
          profile_id_psub: string;
          rejected_at_psub?: string | null;
          rejected_by_psub?: string | null;
          rejection_reason_psub?: string | null;
          status_psub?: Database['public']['Enums']['subscription_status'];
          subscribed_at_psub?: string;
          subscription_id_psub: string;
          updated_at_psub?: string;
        };
        Update: {
          approved_at_psub?: string | null;
          approved_by_psub?: string | null;
          cancelled_at_psub?: string | null;
          created_at_psub?: string;
          expires_at_psub?: string | null;
          id_psub?: string;
          payment_note_psub?: string | null;
          payment_reference_psub?: string;
          profile_id_psub?: string;
          rejected_at_psub?: string | null;
          rejected_by_psub?: string | null;
          rejection_reason_psub?: string | null;
          status_psub?: Database['public']['Enums']['subscription_status'];
          subscribed_at_psub?: string;
          subscription_id_psub?: string;
          updated_at_psub?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_subscriptions_approved_by_psub_fkey';
            columns: ['approved_by_psub'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'profile_subscriptions_profile_id_psub_fkey';
            columns: ['profile_id_psub'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'profile_subscriptions_rejected_by_psub_fkey';
            columns: ['rejected_by_psub'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'profile_subscriptions_subscription_id_psub_fkey';
            columns: ['subscription_id_psub'];
            isOneToOne: false;
            referencedRelation: 'subscription';
            referencedColumns: ['id_sub'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at_prf: string | null;
          first_name_prf: string | null;
          id_prf: string;
          is_active_prf: boolean | null;
          last_name1_prf: string | null;
          last_name2_prf: string | null;
          phone_number_prf: string | null;
          profile_photo_path_prf: string | null;
          role_prf: Database['public']['Enums']['user_role'] | null;
          terms_accepted_at_prf: string | null;
          terms_version_prf: string | null;
          updated_at_prf: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at_prf?: string | null;
          first_name_prf?: string | null;
          id_prf: string;
          is_active_prf?: boolean | null;
          last_name1_prf?: string | null;
          last_name2_prf?: string | null;
          phone_number_prf?: string | null;
          profile_photo_path_prf?: string | null;
          role_prf?: Database['public']['Enums']['user_role'] | null;
          terms_accepted_at_prf?: string | null;
          terms_version_prf?: string | null;
          updated_at_prf?: string | null;
        };
        Update: {
          created_at_prf?: string | null;
          first_name_prf?: string | null;
          id_prf?: string;
          is_active_prf?: boolean | null;
          last_name1_prf?: string | null;
          last_name2_prf?: string | null;
          phone_number_prf?: string | null;
          profile_photo_path_prf?: string | null;
          role_prf?: Database['public']['Enums']['user_role'] | null;
          terms_accepted_at_prf?: string | null;
          terms_version_prf?: string | null;
          updated_at_prf?: string | null;
        };
        Relationships: [];
      };
      promotion_category_map: {
        Row: {
          category_id_pcr: string;
          promotion_id_pcr: string;
        };
        ComputedFields: never;
        Insert: {
          category_id_pcr: string;
          promotion_id_pcr: string;
        };
        Update: {
          category_id_pcr?: string;
          promotion_id_pcr?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_category_map_category_id_pcr_fkey';
            columns: ['category_id_pcr'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
          {
            foreignKeyName: 'promotion_category_map_promotion_id_pcr_fkey';
            columns: ['promotion_id_pcr'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotion_combo_items: {
        Row: {
          created_at_pci: string | null;
          id_pci: string;
          paid_quantity_pci: number | null;
          product_id_pci: string;
          promotion_id_pci: string;
          quantity_pci: number;
        };
        ComputedFields: never;
        Insert: {
          created_at_pci?: string | null;
          id_pci?: string;
          paid_quantity_pci?: number | null;
          product_id_pci: string;
          promotion_id_pci: string;
          quantity_pci?: number;
        };
        Update: {
          created_at_pci?: string | null;
          id_pci?: string;
          paid_quantity_pci?: number | null;
          product_id_pci?: string;
          promotion_id_pci?: string;
          quantity_pci?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_combo_items_product_id_pci_fkey';
            columns: ['product_id_pci'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
          {
            foreignKeyName: 'promotion_combo_items_promotion_id_pci_fkey';
            columns: ['promotion_id_pci'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotion_images: {
        Row: {
          created_at_pim: string | null;
          id_pim: string;
          path_pim: string;
          promotion_id_pim: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_pim?: string | null;
          id_pim?: string;
          path_pim: string;
          promotion_id_pim: string;
        };
        Update: {
          created_at_pim?: string | null;
          id_pim?: string;
          path_pim?: string;
          promotion_id_pim?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_images_promotion_id_fkey';
            columns: ['promotion_id_pim'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotion_products: {
        Row: {
          product_id_ppr: string;
          promotion_id_ppr: string;
        };
        ComputedFields: never;
        Insert: {
          product_id_ppr: string;
          promotion_id_ppr: string;
        };
        Update: {
          product_id_ppr?: string;
          promotion_id_ppr?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_products_product_id_ppr_fkey';
            columns: ['product_id_ppr'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
          {
            foreignKeyName: 'promotion_products_promotion_id_ppr_fkey';
            columns: ['promotion_id_ppr'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotion_scope_categories: {
        Row: {
          category_id_psc: string;
          created_at_psc: string | null;
          promotion_id_psc: string;
        };
        ComputedFields: never;
        Insert: {
          category_id_psc: string;
          created_at_psc?: string | null;
          promotion_id_psc: string;
        };
        Update: {
          category_id_psc?: string;
          created_at_psc?: string | null;
          promotion_id_psc?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_scope_categories_category_id_psc_fkey';
            columns: ['category_id_psc'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
          {
            foreignKeyName: 'promotion_scope_categories_promotion_id_psc_fkey';
            columns: ['promotion_id_psc'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotions: {
        Row: {
          business_id_prm: string | null;
          created_at_prm: string | null;
          created_by_prm: string | null;
          description_prm: string | null;
          discount_type_prm: Database['public']['Enums']['discount_type'] | null;
          discount_value_prm: number | null;
          end_at_prm: string | null;
          id_prm: string;
          is_active_prm: boolean | null;
          is_blocked_prm: boolean;
          moderation_note_prm: string | null;
          moderation_status_prm: Database['public']['Enums']['moderation_status'] | null;
          payment_note_admin_prm: string | null;
          payment_state_prm: Database['public']['Enums']['payment_state'];
          reviewed_at_prm: string | null;
          reviewed_by_prm: string | null;
          scope_prm: Database['public']['Enums']['promotion_scope'] | null;
          start_at_prm: string | null;
          title_prm: string | null;
          updated_at_prm: string | null;
        };
        ComputedFields: never;
        Insert: {
          business_id_prm?: string | null;
          created_at_prm?: string | null;
          created_by_prm?: string | null;
          description_prm?: string | null;
          discount_type_prm?: Database['public']['Enums']['discount_type'] | null;
          discount_value_prm?: number | null;
          end_at_prm?: string | null;
          id_prm?: string;
          is_active_prm?: boolean | null;
          is_blocked_prm?: boolean;
          moderation_note_prm?: string | null;
          moderation_status_prm?: Database['public']['Enums']['moderation_status'] | null;
          payment_note_admin_prm?: string | null;
          payment_state_prm?: Database['public']['Enums']['payment_state'];
          reviewed_at_prm?: string | null;
          reviewed_by_prm?: string | null;
          scope_prm?: Database['public']['Enums']['promotion_scope'] | null;
          start_at_prm?: string | null;
          title_prm?: string | null;
          updated_at_prm?: string | null;
        };
        Update: {
          business_id_prm?: string | null;
          created_at_prm?: string | null;
          created_by_prm?: string | null;
          description_prm?: string | null;
          discount_type_prm?: Database['public']['Enums']['discount_type'] | null;
          discount_value_prm?: number | null;
          end_at_prm?: string | null;
          id_prm?: string;
          is_active_prm?: boolean | null;
          is_blocked_prm?: boolean;
          moderation_note_prm?: string | null;
          moderation_status_prm?: Database['public']['Enums']['moderation_status'] | null;
          payment_note_admin_prm?: string | null;
          payment_state_prm?: Database['public']['Enums']['payment_state'];
          reviewed_at_prm?: string | null;
          reviewed_by_prm?: string | null;
          scope_prm?: Database['public']['Enums']['promotion_scope'] | null;
          start_at_prm?: string | null;
          title_prm?: string | null;
          updated_at_prm?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'promotions_business_id_prm_fkey';
            columns: ['business_id_prm'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'promotions_created_by_prm_fkey';
            columns: ['created_by_prm'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'promotions_reviewed_by_prm_fkey';
            columns: ['reviewed_by_prm'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      provinces: {
        Row: {
          country_id_prv: string;
          created_at_prv: string | null;
          id_prv: string;
          name_prv: string;
        };
        ComputedFields: never;
        Insert: {
          country_id_prv: string;
          created_at_prv?: string | null;
          id_prv?: string;
          name_prv: string;
        };
        Update: {
          country_id_prv?: string;
          created_at_prv?: string | null;
          id_prv?: string;
          name_prv?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'provinces_country_id_fkey';
            columns: ['country_id_prv'];
            isOneToOne: false;
            referencedRelation: 'countries';
            referencedColumns: ['id_cnt'];
          },
        ];
      };
      review_moderation_log: {
        Row: {
          admin_id_rml: string | null;
          created_at_rml: string;
          id_rml: string;
          new_comment_rml: string | null;
          new_rating_rml: number | null;
          old_comment_rml: string | null;
          old_rating_rml: number | null;
          review_id_rml: string;
          review_table_rml: string;
        };
        ComputedFields: never;
        Insert: {
          admin_id_rml?: string | null;
          created_at_rml?: string;
          id_rml?: string;
          new_comment_rml?: string | null;
          new_rating_rml?: number | null;
          old_comment_rml?: string | null;
          old_rating_rml?: number | null;
          review_id_rml: string;
          review_table_rml: string;
        };
        Update: {
          admin_id_rml?: string | null;
          created_at_rml?: string;
          id_rml?: string;
          new_comment_rml?: string | null;
          new_rating_rml?: number | null;
          old_comment_rml?: string | null;
          old_rating_rml?: number | null;
          review_id_rml?: string;
          review_table_rml?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_moderation_log_admin_id_rml_fkey';
            columns: ['admin_id_rml'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      subscription: {
        Row: {
          created_at_sub: string;
          description_sub: string;
          display_order_sub: number;
          features_sub: string[];
          id_sub: string;
          is_active_sub: boolean;
          is_recurring_sub: boolean;
          name_sub: string;
          price_sub: number;
          quota_sub: number;
          type_sub: string;
          updated_at_sub: string;
        };
        ComputedFields: never;
        Insert: {
          created_at_sub?: string;
          description_sub: string;
          display_order_sub?: number;
          features_sub: string[];
          id_sub?: string;
          is_active_sub?: boolean;
          is_recurring_sub?: boolean;
          name_sub: string;
          price_sub: number;
          quota_sub?: number;
          type_sub: string;
          updated_at_sub?: string;
        };
        Update: {
          created_at_sub?: string;
          description_sub?: string;
          display_order_sub?: number;
          features_sub?: string[];
          id_sub?: string;
          is_active_sub?: boolean;
          is_recurring_sub?: boolean;
          name_sub?: string;
          price_sub?: number;
          quota_sub?: number;
          type_sub?: string;
          updated_at_sub?: string;
        };
        Relationships: [];
      };
      subscription_usage: {
        Row: {
          attraction_id_sus: string | null;
          business_id_sus: string | null;
          created_at_sus: string;
          event_id_sus: string | null;
          id_sus: string;
          max_quota_sus: number;
          profile_id_sus: string;
          profile_subscription_id_sus: string;
          resource_type_sus: Database['public']['Enums']['resource_type'];
          updated_at_sus: string;
          used_count_sus: number;
        };
        ComputedFields: never;
        Insert: {
          attraction_id_sus?: string | null;
          business_id_sus?: string | null;
          created_at_sus?: string;
          event_id_sus?: string | null;
          id_sus?: string;
          max_quota_sus: number;
          profile_id_sus: string;
          profile_subscription_id_sus: string;
          resource_type_sus: Database['public']['Enums']['resource_type'];
          updated_at_sus?: string;
          used_count_sus?: number;
        };
        Update: {
          attraction_id_sus?: string | null;
          business_id_sus?: string | null;
          created_at_sus?: string;
          event_id_sus?: string | null;
          id_sus?: string;
          max_quota_sus?: number;
          profile_id_sus?: string;
          profile_subscription_id_sus?: string;
          resource_type_sus?: Database['public']['Enums']['resource_type'];
          updated_at_sus?: string;
          used_count_sus?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_usage_attraction_id_sus_fkey';
            columns: ['attraction_id_sus'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'subscription_usage_business_id_sus_fkey';
            columns: ['business_id_sus'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'subscription_usage_event_id_sus_fkey';
            columns: ['event_id_sus'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'subscription_usage_profile_id_sus_fkey';
            columns: ['profile_id_sus'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'subscription_usage_profile_subscription_id_sus_fkey';
            columns: ['profile_subscription_id_sus'];
            isOneToOne: false;
            referencedRelation: 'profile_subscriptions';
            referencedColumns: ['id_psub'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      _cols_changed: { Args: { p_cols: string[]; p_new: Json; p_old: Json }; Returns: boolean };
      _default_user_role: { Args: Record<PropertyKey, never>; Returns: string };
      _free_resource_limit: { Args: { p_resource: string }; Returns: number };
      _is_privileged: { Args: Record<PropertyKey, never>; Returns: boolean };
      _plan_resource_quota: { Args: { p_plan: string; p_resource: string }; Returns: number };
      _psub_plan_type: { Args: { p_psub_id: string }; Returns: string };
      _restore_cols: {
        Args: { p_cols: string[]; p_new: unknown; p_old: unknown };
        Returns: unknown;
      };
      _set_cols: { Args: { p_new: unknown; p_values: Json }; Returns: unknown };
      calculate_subscription_expiry: {
        Args: { approval_date?: string; subscription_type: string };
        Returns: string;
      };
      create_user_profile: {
        Args: {
          p_first_name: string;
          p_last_name1: string;
          p_last_name2?: string;
          p_phone?: string;
          p_photo_path?: string;
          p_role?: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      delete_my_account: { Args: Record<PropertyKey, never>; Returns: undefined };
      expire_monthly_subscriptions: { Args: Record<PropertyKey, never>; Returns: number };
      get_available_quota: {
        Args: {
          p_entity_id: string;
          p_profile_id: string;
          p_resource_type: Database['public']['Enums']['resource_type'];
        };
        Returns: {
          available: number;
          total_quota: number;
          total_used: number;
        }[];
      };
      get_category_path: {
        Args: { category_id: string };
        Returns: {
          id_cat: string;
          level: number;
          name_cat: string;
        }[];
      };
      get_like_counts: {
        Args: { p_ids: string[]; p_table: string };
        Returns: {
          likes: number;
          target_id: string;
        }[];
      };
      get_my_profile: {
        Args: Record<PropertyKey, never>;
        Returns: {
          created_at_prf: string | null;
          first_name_prf: string | null;
          id_prf: string;
          is_active_prf: boolean | null;
          last_name1_prf: string | null;
          last_name2_prf: string | null;
          phone_number_prf: string | null;
          profile_photo_path_prf: string | null;
          role_prf: Database['public']['Enums']['user_role'] | null;
          terms_accepted_at_prf: string | null;
          terms_version_prf: string | null;
          updated_at_prf: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_my_role: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['Enums']['user_role'];
      };
      get_owner_like_buckets: {
        Args: { p_business_ids: string[]; p_since: string };
        Returns: {
          bucket_hour: string;
          business_id: string;
          likes: number;
        }[];
      };
      get_owner_like_totals: {
        Args: { p_business_ids: string[] };
        Returns: {
          business_id: string;
          likes: number;
        }[];
      };
      get_subcategories: {
        Args: { parent_category_id: string };
        Returns: {
          id_cat: string;
          level: number;
          name_cat: string;
          parent_id_cat: string;
        }[];
      };
      image_prefix_from_path: { Args: { p_path: string }; Returns: string };
      is_active_user: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_premium: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_seller_or_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_valid_role_update: {
        Args: {
          new_role: Database['public']['Enums']['user_role'];
          old_role: Database['public']['Enums']['user_role'];
        };
        Returns: boolean;
      };
      is_valid_uuid: { Args: { p_text: string }; Returns: boolean };
      owns_attraction: { Args: { p_attraction_id: string }; Returns: boolean };
      owns_business: { Args: { p_business_id: string }; Returns: boolean };
      owns_event: { Args: { p_event_id: string }; Returns: boolean };
      owns_product: { Args: { p_product_id: string }; Returns: boolean };
      owns_promotion: { Args: { p_promotion_id: string }; Returns: boolean };
      resource_limit: { Args: { p_entity_id: string; p_resource: string }; Returns: number };
      storage_filename_from_path: { Args: { p_path: string }; Returns: string };
      storage_folder_from_path: { Args: { p_path: string }; Returns: string };
      update_attraction_rating: { Args: { p_attraction_id: string }; Returns: undefined };
      update_business_rating: { Args: { p_business_id: string }; Returns: undefined };
      update_event_rating: { Args: { p_event_id: string }; Returns: undefined };
      update_product_rating: { Args: { p_product_id: string }; Returns: undefined };
    };
    Enums: {
      discount_type: 'percentage' | 'fixed';
      interaction_type:
        | 'view_business'
        | 'view_event'
        | 'view_attraction'
        | 'view_review'
        | 'contact_click'
        | 'call_click'
        | 'email_click'
        | 'website_click'
        | 'map_click'
        | 'share_click'
        | 'whatsapp_click'
        | 'instagram_click'
        | 'facebook_click'
        | 'tiktok_click'
        | 'youtube_click';
      moderation_status: 'pending' | 'approved' | 'rejected';
      payment_state: 'pending' | 'paid' | 'rejected';
      promotion_scope: 'all' | 'products' | 'categories' | 'combo';
      resource_type:
        'product' | 'photo_business' | 'photo_attraction' | 'photo_event' | 'promotion';
      subscription_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
      subscription_type:
        | 'promotions'
        | 'dashboard'
        | 'gallery_business'
        | 'package_products'
        | 'gallery_attractions'
        | 'full_premium'
        | 'gallery_events';
      user_role: 'user' | 'seller' | 'admin' | 'premium' | 'buyer';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      discount_type: ['percentage', 'fixed'],
      interaction_type: [
        'view_business',
        'view_event',
        'view_attraction',
        'view_review',
        'contact_click',
        'call_click',
        'email_click',
        'website_click',
        'map_click',
        'share_click',
        'whatsapp_click',
        'instagram_click',
        'facebook_click',
        'tiktok_click',
        'youtube_click',
      ],
      moderation_status: ['pending', 'approved', 'rejected'],
      payment_state: ['pending', 'paid', 'rejected'],
      promotion_scope: ['all', 'products', 'categories', 'combo'],
      resource_type: ['product', 'photo_business', 'photo_attraction', 'photo_event', 'promotion'],
      subscription_status: ['pending', 'approved', 'rejected', 'cancelled', 'expired'],
      subscription_type: [
        'promotions',
        'dashboard',
        'gallery_business',
        'package_products',
        'gallery_attractions',
        'full_premium',
        'gallery_events',
      ],
      user_role: ['user', 'seller', 'admin', 'premium', 'buyer'],
    },
  },
} as const;
