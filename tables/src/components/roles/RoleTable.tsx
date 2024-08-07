import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { IUser } from "../../interfaces/IUser";
import { useQuery } from "react-query";
import { IRole } from "../../interfaces/IRole";

type RoleTableProps = {
  projectName: string;
  users: IUser[];
};

interface IRoleTable {
  roleName: string;
  usersArray: string[];
  description: string;
}

export const RoleTable = (props: RoleTableProps) => {
  const columns = useMemo<MRT_ColumnDef<IRoleTable>[]>(
    () => [
      {
        accessorKey: "roleName",
        header: "Role",
      },
      {
        accessorKey: "usersArray",
        header: "Users",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  const { data: roles } = useQuery<IRole[]>(["roles"]);
  const { data: users } = useQuery<IUser[]>(["users"]);

  const insertBetween = (ele: string, array: string[]) => {
    return array.flatMap((x) => [ele, x]).slice(1);
  };

  const proccessedData = useMemo(() => {
    if (users == null || users!.length < 0) return [];
    if (roles == null || roles!.length < 0) return [];
    const dataToDisplay: IRoleTable[] = [];
    for (let i = 0; i < roles.length; i++) {
      const roleRow: IRoleTable = {
        roleName: roles[i].roleName,
        description: roles[i].description || "",
        usersArray: users
          .filter((user) => user.role === roles[i].roleName)
          .map((user) => `${user.name.first} ${user.name.last}`),
      };
      roleRow.usersArray = insertBetween(", ", roleRow.usersArray);
      dataToDisplay.push(roleRow);
    }
    return dataToDisplay;
  }, [users]);

  const table = useMaterialReactTable({
    columns: columns,
    data: proccessedData,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
  });

  return <MaterialReactTable table={table} />;
};
