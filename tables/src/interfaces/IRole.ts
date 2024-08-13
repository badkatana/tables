export interface IRole {
  roleName: string;
  roleId: string;
  description?: string;
  usersArray?: string[] | null;
}
