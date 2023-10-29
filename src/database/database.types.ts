export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            carts: {
                Row: {
                    created_at: string;
                    id: number;
                    items: Json[] | null;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    items?: Json[] | null;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    items?: Json[] | null;
                };
                Relationships: [];
            };
            products: {
                Row: {
                    author_id: string;
                    category: string;
                    created_at: string;
                    description: string | null;
                    id: string;
                    inventory: number;
                    isPublic: boolean;
                    name: string;
                    price: number;
                    product_images: string[] | null;
                    rating: number;
                    store_id: string;
                    sub_category: string;
                };
                Insert: {
                    author_id?: string;
                    category: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    inventory: number;
                    isPublic?: boolean;
                    name: string;
                    price: number;
                    product_images?: string[] | null;
                    rating?: number;
                    store_id?: string;
                    sub_category: string;
                };
                Update: {
                    author_id?: string;
                    category?: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    inventory?: number;
                    isPublic?: boolean;
                    name?: string;
                    price?: number;
                    product_images?: string[] | null;
                    rating?: number;
                    store_id?: string;
                    sub_category?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'products_author_id_fkey';
                        columns: ['author_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'products_store_id_fkey';
                        columns: ['store_id'];
                        referencedRelation: 'stores';
                        referencedColumns: ['id'];
                    }
                ];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    created_at: string;
                    email: string;
                    fullName: string;
                    user_id: string;
                };
                Insert: {
                    avatar_url?: string | null;
                    created_at?: string;
                    email: string;
                    fullName: string;
                    user_id?: string;
                };
                Update: {
                    avatar_url?: string | null;
                    created_at?: string;
                    email?: string;
                    fullName?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'profiles_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    }
                ];
            };
            stores: {
                Row: {
                    author_id: string;
                    created_at: string;
                    description: string | null;
                    id: string;
                    name: string;
                };
                Insert: {
                    author_id: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name: string;
                };
                Update: {
                    author_id?: string;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'stores_author_id_fkey';
                        columns: ['author_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            delete_avatar: {
                Args: {
                    avatar_url: string;
                };
                Returns: Record<string, unknown>;
            };
            delete_storage_object: {
                Args: {
                    bucket: string;
                    object: string;
                };
                Returns: Record<string, unknown>;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
