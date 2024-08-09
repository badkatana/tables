import $host from ".";
import { IUser } from "../interfaces/IUser";

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

export const deleteUser = async (userId: string) => {
  const { data } = await $host.delete(`/users/${userId}`);
  return data;
};

export const updateUser = async (updatedUser: IUser) => {
  const response = await $host.put(
    `/users/update/${updatedUser.id}`,
    updatedUser
  );

  return response.data;
};
