import $host from ".";
import { IRole } from "../interfaces/IRole";

export const getRoles = async () => {
  const { data } = await $host.get("/roles");
  return data;
};

export const createRole = async (newRole: IRole) => {
  const { data } = await $host.post("/roles/create", newRole);
  return data;
};

export const editRole = async (editedRole: IRole) => {
  const { data } = await $host.put("/roles/edit", editedRole);
  return data;
};

export const deleteRole = async (RoleToDeleteId: string) => {
  const { data } = await $host.delete(`/roles/${RoleToDeleteId}`);
  return data;
};
