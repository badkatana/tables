import { IUser } from "../interfaces/IUser";

export function isEmpty(obj: any) {
  return Object.keys(obj).some((x) => obj[x] !== void 0);
}

export const insertBetween = (ele: string, array: string[]) => {
  return array.flatMap((x) => [ele, x]).slice(1);
};

export function IsArrayEmpty(arr: any[]) {
  return arr.length === 0 || arr === null;
}

export function getUsersWithSomeFieldValue(
  fieldValue: string,
  targetField: keyof IUser,
  users: IUser[]
) {
  let usersWithThisRole = users!
    .filter((user) => user[targetField] === fieldValue)
    .map((user) => `${user.name.first} ${user.name.last}`);
  usersWithThisRole = insertBetween(", ", usersWithThisRole);
  return usersWithThisRole;
}
