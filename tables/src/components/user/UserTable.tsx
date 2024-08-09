import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, MenuItem, Select } from "@mui/material";
import { IUser } from "../../interfaces/IUser";
import { useMutation, useQuery } from "react-query";
import { deleteUser, updateUser, updateUsersRoles } from "../../http/functions";
import { IRole } from "../../interfaces/IRole";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { DeleteUserModal } from "./deleteUserModal/deleteUserModal";

export const UserTable = () => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [data, setData] = useState<IUser[]>();
  const [personToDelete, setPersonToDelete] = useState<IUser>();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { data: userData } = useQuery<IUser[]>(["users"]);
  const { data: roles } = useQuery<IRole[]>(["roles"]);
  const [selectedRole, setSelectedRole] = useState(roles![0].roleName || "");

  useEffect(() => {
    if (Object.keys(rowSelection).length) {
      setRoleSelectOpen(true);
    } else {
      setRoleSelectOpen(false);
    }
  }, [rowSelection]);

  useEffect(() => {
    setData(userData);
  }, [userData]);

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

  const deleteMutation = useMutation((userId: string) => deleteUser(userId), {
    onSuccess: (data) => {
      console.log("Users updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating users:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: IUser) => updateUser(updatedData),
    onSuccess: () => {
      console.log("к");
    },
    onError: (error) => {
      console.log("error here");
    },
  });

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        enableSorting: false,
        size: 0,
      },
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
        accessorKey: "role",
        header: "Role",
        enableEditing: false,
      },
      {
        accessorKey: "accessibility",
        header: "Accessibility",
        enableEditing: false,
      },
    ],
    []
  );

  const handleRowUpdating = (values: any) => {
    const userToUpdate = data!.find((user) => user.id === values.id);
    if (userToUpdate) {
      userToUpdate.name.first = values["name.first"];
      userToUpdate.name.last = values["name.last"];
      userToUpdate.email = values.email;
      userToUpdate.accessibility = values.accessibility;
      updateMutation.mutate(userToUpdate);
    }
  };
  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    defaultDisplayColumn: { enableResizing: true },
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowSelection: true,
    positionActionsColumn: "last",
    onRowSelectionChange: setRowSelection,
    state: { rowSelection, columnVisibility: { id: false } },
    enableRowActions: true,
    onEditingRowSave: ({ table, values }) => {
      handleRowUpdating(values);
      table.setEditingRow(null);
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
        <IconButton
          onClick={() => {
            table.setEditingRow(row);
          }}
        >
          <CreateRoundedIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setPersonToDelete(data![row.index]);
            setDeleteModalVisible(true);
          }}
        >
          <DeleteOutlineRoundedIcon />
        </IconButton>
      </Box>
    ),
  });

  const handleUserDelete = (confirmed: boolean) => {
    if (confirmed) {
      deleteMutation.mutate(personToDelete!.id);
      const updatedData = data!.filter(
        (person) => person.id != personToDelete!.id
      );
      setData(updatedData);
    }
    setPersonToDelete(undefined);
    setDeleteModalVisible(false);
  };

  const handleSelectionClick = () => {
    const rowIndexed = Object.keys(rowSelection).map((key) => parseInt(key));
    const userIds1 = [];
    for (let i = 0; i < rowIndexed.length; i++) {
      userIds1.push(userData![rowIndexed[i]].id);
      data![rowIndexed[i]].role = selectedRole;
    }
    setData([...data!]);
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
      <DeleteUserModal
        open={deleteModalVisible}
        handleClose={handleUserDelete}
      />
      <MaterialReactTable table={table} />;
    </Box>
  );
};
