import $host from ".";
import { IUser } from "../interfaces/User";

export const getUsers = async (): Promise<IUser[]> => {
  const { data } = await $host.get("/users");
  return data.results;
};

export const getRoles = async () => {
  const { data } = await $host.get("/roles");
  return data;
};

export const updateUsersRoles = async (usersId: string, role: string) => {
  const { data } = await $host.put(`/users/${usersId}`, null, {
    params: { role: `${role}` },
  });
  return data;
};
