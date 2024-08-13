import { useMemo } from "react";
import { IRole } from "../interfaces/IRole";
import { useQuery } from "react-query";
import { getUsersWithSomeFieldValue, IsArrayEmpty } from "../lib/lib";
import { getRoles } from "../http/roleAPI";
import useUser from "./useUser";

export function useRoles() {
  const {
    data: roles,
    error: rolesError,
    isLoading: rolesLoading,
  } = useQuery<IRole[], Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
  const { users } = useUser();

  const proccessedData = useMemo(() => {
    if (!IsArrayEmpty(users!) || !IsArrayEmpty(roles!)) {
      const dataToDisplay: IRole[] = [];
      for (let i = 0; i < roles!.length; i++) {
        const roleRow: IRole = {
          roleId: roles![i].roleId,
          roleName: roles![i].roleName,
          description: roles![i].description || "",
          usersArray: getUsersWithSomeFieldValue(
            roles![i].roleName,
            "role",
            users!
          ),
        };
        dataToDisplay.push(roleRow);
      }
      return dataToDisplay;
    } else return [];
  }, [roles, users]);

  return { roles: proccessedData, rolesError, rolesLoading };
}
