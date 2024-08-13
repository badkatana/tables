import { IUser } from "../interfaces/IUser";
import { useQuery } from "react-query";
import { useMemo } from "react";
import { getUsers } from "../http/userAPI";

export default function useUser() {
  const { data, error, isLoading } = useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const proccessedUsers = useMemo(() => data, [data]);
  return { users: proccessedUsers, error, isLoading };
}
