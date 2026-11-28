export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          status: string
          label: string
          priority: string
          created_at: string
        }
        Insert: {
          id: string
          title: string
          status?: string
          label?: string
          priority?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          status?: string
          label?: string
          priority?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
