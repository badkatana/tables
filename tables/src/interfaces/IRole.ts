export interface IRole {
  roleName: string;
  roleId: number;
  description?: string;
  usersArray?: string[] | null;
}
