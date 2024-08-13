import { IUser } from "../interfaces/IUser";

export function isEmpty(obj: any) {
  return Object.keys(obj).some((x) => obj[x] !== void 0);
}

export const insertBetween = (ele: string, array: string[]) => {
  return array.flatMap((x) => [ele, x]).slice(1);
};

export function IsArrayEmpty(arr: any[]) {
  try {
    return arr.length === 0 || arr === null ? true : false;
  } catch {
    console.log("error checking array");
    return true;
  }
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

export function createNumericId<T>(arr: T[], idField: keyof T): string {
  if (arr.length === 0) {
    return "1";
  }

  const lastId = arr[arr.length - 1][idField] as unknown as string;
  const nextId = (parseInt(lastId, 10) + 1).toString();

  return nextId;
}
