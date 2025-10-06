export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          in_stock: boolean
          is_featured: boolean
          stock_quantity: number
          min_order: number
          unit: string
          weight: number
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          in_stock?: boolean
          is_featured?: boolean
          stock_quantity: number
          min_order?: number
          unit: string
          weight: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          in_stock?: boolean
          is_featured?: boolean
          stock_quantity?: number
          min_order?: number
          unit?: string
          weight?: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
