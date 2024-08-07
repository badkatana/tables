import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { IUser } from "../../interfaces/IUser";
import { useMutation, useQuery } from "react-query";
import { updateUsersRoles } from "../../http/functions";
import { IRole } from "../../interfaces/IRole";

export const UserTable = () => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(rowSelection).length) {
      setRoleSelectOpen(true);
    } else {
      setRoleSelectOpen(false);
    }
  }, [rowSelection]);

  const { data: userData } = useQuery<IUser[]>(["users"]);
  const { data: roles } = useQuery<IRole[]>(["roles"]);
  const [selectedRole, setSelectedRole] = useState(roles![0].roleName || "");
  const mutation = useMutation(
    (data: { userIds: string; role: string }) =>
      updateUsersRoles(data.userIds, data.role),
    {
      onSuccess: (data) => {
        console.log("Users updated successfully:", data);
      },
      onError: (error) => {
        console.error("Error updating users:", error);
      },
    }
  );

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "name.first",
        header: "First Name",
      },
      {
        accessorKey: "name.last",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "dob.age",
        header: "Age",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "accessibility",
        header: "Accessibility",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns: columns,
    data: userData || [],
    defaultDisplayColumn: { enableResizing: true },
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowSelection: true,
    positionToolbarAlertBanner: "bottom",
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const handleSelectionClick = () => {
    const rowIndexed = Object.keys(rowSelection).map((key) => parseInt(key));
    const userIds1 = [];
    for (let i = 0; i < rowIndexed.length; i++) {
      userIds1.push(userData![rowIndexed[i]].id);
    }
    const userIds = userIds1.join(",");
    const role = selectedRole;
    mutation.mutate({ userIds, role });
    setSelectedRole(roles![0].roleName);
    setRowSelection({});
  };

  return (
    <Box>
      {roleSelectOpen && roles != null ? (
        <Box>
          <Select defaultValue={roles[0].roleName}>
            {roles.map((role) => (
              <MenuItem
                value={role.roleName}
                onClick={() => setSelectedRole(role.roleName)}
              >
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={(e) => handleSelectionClick()}>Confirm</Button>
          <Button onClick={(e) => setRowSelection({})}>Cancel</Button>
        </Box>
      ) : null}
      <MaterialReactTable table={table} />;
    </Box>
  );
};
