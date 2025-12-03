import { supabase } from '../lib/supabase'
import { Application } from '../types'

export interface ApplicationWithRelations extends Application {
  stakeholders: Array<{
    id: string
    role: string
    name: string
    email?: string
  }>
  relationships: Array<{
    id: string
    target_app_code: string
    relationship_type: 'functional' | 'technical'
  }>
}

export class ApplicationService {
  async getAllApplications(): Promise<ApplicationWithRelations[]> {
    try {
      // Get applications with stakeholders and relationships
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          stakeholders (*),
          application_relationships (*)
        `)
        .order('updated_at', { ascending: false })

      if (appsError) throw appsError

      return applications?.map(app => this.transformApplication(app)) || []
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  }

  async getApplicationById(id: string): Promise<ApplicationWithRelations | null> {
    try {
      const { data: application, error } = await supabase
        .from('applications')
        .select(`
          *,
          stakeholders (*),
          application_relationships (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!application) return null

      return this.transformApplication(application)
    } catch (error) {
      console.error('Error fetching application:', error)
      throw error
    }
  }

  async createApplication(applicationData: Partial<Application>): Promise<ApplicationWithRelations> {
    try {
      const { stakeholders, relatedApps, ...appData } = applicationData as any

      // Insert application
      const { data: newApp, error: appError } = await supabase
        .from('applications')
        .insert([{
          app_code: appData.appCode,
          name: appData.name,
          description: appData.description,
          functional_domains: appData.functionalDomains,
          technical_stack: appData.technicalStack,
          status: appData.status || 'Under Development'
        }])
        .select()
        .single()

      if (appError) throw appError

      // Insert stakeholders
      if (stakeholders && Object.keys(stakeholders).length > 0) {
        const stakeholderInserts = Object.entries(stakeholders)
          .filter(([_, name]) => name && name.trim())
          .map(([role, name]) => ({
            application_id: newApp.id,
            role,
            name: name as string,
            email: ''
          }))

        if (stakeholderInserts.length > 0) {
          const { error: stakeholdersError } = await supabase
            .from('stakeholders')
            .insert(stakeholderInserts)

          if (stakeholdersError) throw stakeholdersError
        }
      }

      // Insert relationships
      if (relatedApps) {
        const relationshipInserts = [
          ...relatedApps.functional.map((appCode: string) => ({
            source_app_id: newApp.id,
            target_app_code: appCode,
            relationship_type: 'functional' as const
          })),
          ...relatedApps.technical.map((appCode: string) => ({
            source_app_id: newApp.id,
            target_app_code: appCode,
            relationship_type: 'technical' as const
          }))
        ]

        if (relationshipInserts.length > 0) {
          const { error: relationshipsError } = await supabase
            .from('application_relationships')
            .insert(relationshipInserts)

          if (relationshipsError) throw relationshipsError
        }
      }

      // Return the created application with relations
      return await this.getApplicationById(newApp.id) as ApplicationWithRelations
    } catch (error) {
      console.error('Error creating application:', error)
      throw error
    }
  }

  async updateApplication(id: string, applicationData: Partial<Application>): Promise<ApplicationWithRelations> {
    try {
      const { stakeholders, relatedApps, ...appData } = applicationData as any

      // Update application
      const { error: appError } = await supabase
        .from('applications')
        .update({
          app_code: appData.appCode,
          name: appData.name,
          description: appData.description,
          functional_domains: appData.functionalDomains,
          technical_stack: appData.technicalStack,
          status: appData.status
        })
        .eq('id', id)

      if (appError) throw appError

      // Update stakeholders
      if (stakeholders) {
        // Delete existing stakeholders
        await supabase
          .from('stakeholders')
          .delete()
          .eq('application_id', id)

        // Insert new stakeholders
        const stakeholderInserts = Object.entries(stakeholders)
          .filter(([_, name]) => name && name.trim())
          .map(([role, name]) => ({
            application_id: id,
            role,
            name: name as string,
            email: ''
          }))

        if (stakeholderInserts.length > 0) {
          const { error: stakeholdersError } = await supabase
            .from('stakeholders')
            .insert(stakeholderInserts)

          if (stakeholdersError) throw stakeholdersError
        }
      }

      // Update relationships
      if (relatedApps) {
        // Delete existing relationships
        await supabase
          .from('application_relationships')
          .delete()
          .eq('source_app_id', id)

        // Insert new relationships
        const relationshipInserts = [
          ...relatedApps.functional.map((appCode: string) => ({
            source_app_id: id,
            target_app_code: appCode,
            relationship_type: 'functional' as const
          })),
          ...relatedApps.technical.map((appCode: string) => ({
            source_app_id: id,
            target_app_code: appCode,
            relationship_type: 'technical' as const
          }))
        ]

        if (relationshipInserts.length > 0) {
          const { error: relationshipsError } = await supabase
            .from('application_relationships')
            .insert(relationshipInserts)

          if (relationshipsError) throw relationshipsError
        }
      }

      return await this.getApplicationById(id) as ApplicationWithRelations
    } catch (error) {
      console.error('Error updating application:', error)
      throw error
    }
  }

  async deleteApplication(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting application:', error)
      throw error
    }
  }

  async searchApplications(query: string): Promise<ApplicationWithRelations[]> {
    try {
      if (!query.trim()) {
        return await this.getAllApplications()
      }

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          stakeholders (*),
          application_relationships (*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,app_code.ilike.%${query}%`)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return applications?.map(app => this.transformApplication(app)) || []
    } catch (error) {
      console.error('Error searching applications:', error)
      throw error
    }
  }

  private transformApplication(app: any): ApplicationWithRelations {
    return {
      id: app.id,
      appCode: app.app_code,
      name: app.name,
      description: app.description || '',
      functionalDomains: app.functional_domains || [],
      technicalStack: app.technical_stack || [],
      status: app.status || 'Under Development',
      relatedApps: {
        functional: app.application_relationships
          ?.filter((rel: any) => rel.relationship_type === 'functional')
          ?.map((rel: any) => rel.target_app_code) || [],
        technical: app.application_relationships
          ?.filter((rel: any) => rel.relationship_type === 'technical')
          ?.map((rel: any) => rel.target_app_code) || []
      },
      stakeholders: app.stakeholders?.reduce((acc: any, stakeholder: any) => {
        acc[stakeholder.role] = stakeholder.name
        return acc
      }, {}) || {
        applicationArchitect: '',
        productOwner: '',
        leadDeveloper: '',
        devOpsEngineer: '',
        securityOfficer: '',
        governanceManager: ''
      },
      createdAt: app.created_at,
      updatedAt: app.updated_at
    }
  }
}

export const applicationService = new ApplicationService()