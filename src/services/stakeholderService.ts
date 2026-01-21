import { supabase } from '../lib/supabase';
import { Stakeholder, StakeholderRole } from '../types';

export class StakeholderService {
  async getAllStakeholders(): Promise<Stakeholder[]> {
    try {
      const { data: stakeholders, error: stakeholderError } = await supabase
        .from('stakeholders')
        .select('*')
        .order('name', { ascending: true });

      if (stakeholderError) throw stakeholderError;
      if (!stakeholders) return [];

      // Deduplicate stakeholders by id (keep only unique people)
      const uniqueStakeholdersMap = new Map<string, any>();
      stakeholders.forEach(s => {
        if (!uniqueStakeholdersMap.has(s.id)) {
          uniqueStakeholdersMap.set(s.id, s);
        }
      });
      const uniqueStakeholders = Array.from(uniqueStakeholdersMap.values());
      const stakeholderIds = uniqueStakeholders.map(s => s.id);

      const { data: roles, error: rolesError } = await supabase
        .from('stakeholder_roles')
        .select('*, applications(app_code)')
        .in('stakeholder_id', stakeholderIds);

      if (rolesError) throw rolesError;

      const rolesMap = new Map<string, StakeholderRole[]>();
      (roles || []).forEach(role => {
        const stakeholderId = role.stakeholder_id;
        if (!rolesMap.has(stakeholderId)) {
          rolesMap.set(stakeholderId, []);
        }
        rolesMap.get(stakeholderId)!.push({
          id: role.id,
          stakeholderId: role.stakeholder_id,
          applicationId: role.application_id,
          applicationCode: role.applications?.app_code,
          role: role.role,
          createdAt: role.created_at
        });
      });

      return uniqueStakeholders.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        department: s.department || 'General',
        position: s.position || '',
        roles: rolesMap.get(s.id) || [],
        createdAt: s.created_at
      }));
    } catch (error) {
      console.error('Error fetching stakeholders:', error);
      throw error;
    }
  }

  async createStakeholder(
    name: string,
    email: string,
    department: string,
    position: string
  ): Promise<Stakeholder> {
    try {
      const { data: stakeholder, error } = await supabase
        .from('stakeholders')
        .insert([{
          name,
          email,
          department,
          position
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: stakeholder.id,
        name: stakeholder.name,
        email: stakeholder.email,
        department: stakeholder.department || 'General',
        position: stakeholder.position || '',
        roles: [],
        createdAt: stakeholder.created_at
      };
    } catch (error) {
      console.error('Error creating stakeholder:', error);
      throw error;
    }
  }

  async updateStakeholder(
    id: string,
    name: string,
    email: string,
    department: string,
    position: string
  ): Promise<Stakeholder> {
    try {
      const { data: stakeholder, error } = await supabase
        .from('stakeholders')
        .update({
          name,
          email,
          department,
          position
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { data: roles, error: rolesError } = await supabase
        .from('stakeholder_roles')
        .select('*, applications(app_code)')
        .eq('stakeholder_id', id);

      if (rolesError) throw rolesError;

      return {
        id: stakeholder.id,
        name: stakeholder.name,
        email: stakeholder.email,
        department: stakeholder.department || 'General',
        position: stakeholder.position || '',
        roles: (roles || []).map(r => ({
          id: r.id,
          stakeholderId: r.stakeholder_id,
          applicationId: r.application_id,
          applicationCode: r.applications?.app_code,
          role: r.role,
          createdAt: r.created_at
        })),
        createdAt: stakeholder.created_at
      };
    } catch (error) {
      console.error('Error updating stakeholder:', error);
      throw error;
    }
  }

  async deleteStakeholder(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stakeholders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      throw error;
    }
  }

  async addStakeholderRole(
    stakeholderId: string,
    applicationId: string,
    role: string
  ): Promise<StakeholderRole> {
    try {
      const { data, error } = await supabase
        .from('stakeholder_roles')
        .insert([{
          stakeholder_id: stakeholderId,
          application_id: applicationId,
          role
        }])
        .select('*, applications(app_code)')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        stakeholderId: data.stakeholder_id,
        applicationId: data.application_id,
        applicationCode: data.applications?.app_code,
        role: data.role,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error adding stakeholder role:', error);
      throw error;
    }
  }

  async removeStakeholderRole(roleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stakeholder_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing stakeholder role:', error);
      throw error;
    }
  }

  async getStakeholdersByApplicationId(applicationId: string): Promise<Stakeholder[]> {
    try {
      const { data: roles, error: rolesError } = await supabase
        .from('stakeholder_roles')
        .select(`
          id,
          role,
          created_at,
          stakeholder_id,
          stakeholders (
            id,
            name,
            email,
            department,
            position,
            created_at
          ),
          applications (
            app_code
          )
        `)
        .eq('application_id', applicationId);

      if (rolesError) throw rolesError;
      if (!roles || roles.length === 0) return [];

      const stakeholderMap = new Map<string, Stakeholder>();
      
      for (const role of roles) {
        const stakeholderId = role.stakeholder_id;
        const stakeholderData = (role.stakeholders as any);
        
        if (!stakeholderMap.has(stakeholderId)) {
          stakeholderMap.set(stakeholderId, {
            id: stakeholderData.id,
            name: stakeholderData.name,
            email: stakeholderData.email,
            department: stakeholderData.department || 'General',
            position: stakeholderData.position || '',
            roles: [],
            createdAt: stakeholderData.created_at
          });
        }
        
        const stakeholder = stakeholderMap.get(stakeholderId)!;
        const appData = (role.applications as any);
        stakeholder.roles.push({
          id: role.id,
          stakeholderId: role.stakeholder_id,
          applicationId: applicationId,
          applicationCode: appData?.app_code,
          role: role.role,
          createdAt: role.created_at
        });
      }

      return Array.from(stakeholderMap.values());
    } catch (error) {
      console.error('Error fetching stakeholders for application:', error);
      throw error;
    }
  }

  async getStakeholdersByDepartment(): Promise<Map<string, Stakeholder[]>> {
    try {
      const stakeholders = await this.getAllStakeholders();
      const departmentMap = new Map<string, Stakeholder[]>();

      stakeholders.forEach(stakeholder => {
        const dept = stakeholder.department || 'General';
        if (!departmentMap.has(dept)) {
          departmentMap.set(dept, []);
        }
        departmentMap.get(dept)!.push(stakeholder);
      });

      return departmentMap;
    } catch (error) {
      console.error('Error grouping stakeholders by department:', error);
      throw error;
    }
  }
}

export const stakeholderService = new StakeholderService();
