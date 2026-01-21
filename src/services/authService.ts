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

      // Get user data from our users table by ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (userError) throw userError

      // If user exists by ID, return it
      if (userData) {
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user'
        }
      }

      // If not found by ID, try by email (handles mismatched IDs)
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (!emailError && emailUser) {
        // Found by email, return it
        return {
          id: emailUser.id,
          email: emailUser.email,
          name: emailUser.name,
          role: emailUser.role || 'user'
        }
      }

      // If user doesn't exist in our users table, create it
      const { data: newUserData, error: createError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email,
          name: authData.user.user_metadata?.name || email.split('@')[0],
          role: authData.user.user_metadata?.role || 'user'
        }])
        .select()
        .single()

      if (createError) {
        // If it's a duplicate key error, try to fetch the user by email again
        if (createError.code === '23505') {
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle()

          if (!fetchError && existingUser) {
            return {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role || 'user'
            }
          }
        }
        throw createError
      }

      return {
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name,
        role: newUserData.role || 'user'
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
        .maybeSingle()

      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }

      // If user exists in our users table, return it
      if (userData) {
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user'
        }
      }

      // If user doesn't exist by ID, check if they exist by email (handles mismatched IDs)
      if (authUser.email) {
        const { data: emailUser, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle()

        if (!emailError && emailUser) {
          // User exists but with different ID, update the ID
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ id: authUser.id })
            .eq('email', authUser.email)
            .select()
            .single()

          if (!updateError && updatedUser) {
            return {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              role: updatedUser.role || 'user'
            }
          }
        }
      }

      // If user doesn't exist at all, create it
      const { data: newUserData, error: createError } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          role: authUser.user_metadata?.role || 'user'
        }])
        .select()
        .single()

      if (createError) {
        // If it's a duplicate email error, try fetching by email one more time
        if (createError.code === '23505' && authUser.email) {
          const { data: fallbackUser, error: fallbackError } = await supabase
            .from('users')
            .select('*')
            .eq('email', authUser.email)
            .maybeSingle()

          if (!fallbackError && fallbackUser) {
            return {
              id: fallbackUser.id,
              email: fallbackUser.email,
              name: fallbackUser.name,
              role: fallbackUser.role || 'user'
            }
          }
        }
        console.error('Error creating user record:', createError)
        return null
      }

      return {
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name,
        role: newUserData.role || 'user'
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
        .maybeSingle()

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