import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          app_code: string
          name: string
          description: string | null
          functional_domains: string[] | null
          technical_stack: string[] | null
          status: 'Active' | 'Inactive' | 'Deprecated' | 'Under Development' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          app_code: string
          name: string
          description?: string | null
          functional_domains?: string[] | null
          technical_stack?: string[] | null
          status?: 'Active' | 'Inactive' | 'Deprecated' | 'Under Development' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          app_code?: string
          name?: string
          description?: string | null
          functional_domains?: string[] | null
          technical_stack?: string[] | null
          status?: 'Active' | 'Inactive' | 'Deprecated' | 'Under Development' | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      stakeholders: {
        Row: {
          id: string
          application_id: string | null
          role: string
          name: string
          email: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          application_id?: string | null
          role: string
          name: string
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          application_id?: string | null
          role?: string
          name?: string
          email?: string | null
          created_at?: string | null
        }
      }
      application_relationships: {
        Row: {
          id: string
          source_app_id: string | null
          target_app_code: string
          relationship_type: 'functional' | 'technical'
          created_at: string | null
        }
        Insert: {
          id?: string
          source_app_id?: string | null
          target_app_code: string
          relationship_type: 'functional' | 'technical'
          created_at?: string | null
        }
        Update: {
          id?: string
          source_app_id?: string | null
          target_app_code?: string
          relationship_type?: 'functional' | 'technical'
          created_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'user' | 'admin' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin' | null
          created_at?: string | null
        }
      }
    }
  }
}