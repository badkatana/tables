export interface IRole {
  roleName: string;
  roleId: number;
  description?: string;
}

export interface IRoleTable {
  roleId: number;
  roleName: string;
  usersArray: string[];
  description: string;
}
