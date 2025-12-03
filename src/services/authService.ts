import { supabase } from '../lib/supabase'
import { User } from '../types'

export class AuthService {
  async signUp(email: string, password: string, name: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: undefined
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Create user record in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([{
          id: authData.user.id,
          email,
          name,
          role
        }], {
          onConflict: 'id'
        })
        .select()
        .single()

      if (userError) throw userError

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to sign in')

      // Get user data from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) throw userError

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return null

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const { data: userData, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single()

      if (error) throw error

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Demo method for quick login without password
  async demoSignIn(email: string, name: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (existingUser) {
        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role || 'user'
        }
      }

      // Create new demo user
      const { data: userData, error } = await supabase
        .from('users')
        .insert([{
          email,
          name,
          role
        }])
        .select()
        .single()

      if (error) throw error

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error with demo sign in:', error)
      throw error
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (session?.user) {
          const user = await this.getCurrentUser()
          callback(user)
        } else {
          callback(null)
        }
      })()
    })
  }
}

export const authService = new AuthService()