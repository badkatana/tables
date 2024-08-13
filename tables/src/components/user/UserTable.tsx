import { useEffect, useMemo, useState } from "react";
import {
  LiteralUnion,
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { IUser } from "../../interfaces/IUser";
import { useMutation } from "react-query";
import { deleteUser, updateUser, updateUsersRoles } from "../../http/userAPI";
import { DeleteUserModal } from "./deleteUserModal";
import { NotifyUser } from "../generic/snackbar";
import useUser from "../../hooks/useUser";
import { isEmpty } from "../../lib/arrayFunctions";
import { UserTableAction } from "./UserTableAction";
import { useRoles } from "../../hooks/useRoles";

export const UserTable = () => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<IUser>();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { roles } = useRoles();
  const { users } = useUser();
  const [selectedRole, setSelectedRole] = useState(roles![0].roleName || "");
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>();

  useEffect(() => {
    setRoleSelectOpen(isEmpty(rowSelection));
  }, [rowSelection]);

  const mutation = useMutation(
    (data: { userIds: string; role: string }) =>
      updateUsersRoles(data.userIds, data.role),
    {
      onSuccess: (data) => {
        setSnackbarMessage("Successfully updated!");
      },
      onError: (error) => {
        setSnackbarMessage("Error updating users");
      },
    }
  );

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  const deleteMutation = useMutation((userId: string) => deleteUser(userId), {
    onSuccess: (data) => {
      setSnackbarMessage("User deleted successfully");
    },
    onError: (error) => {
      setSnackbarMessage("Error occured during user delete");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: IUser) => updateUser(updatedData),
    onSuccess: () => {
      setSnackbarMessage("User deleted successfully");
    },
    onError: (error) => {
      setSnackbarMessage("Error deleting user");
    },
  });

  const handleRowUpdating = (values: Record<LiteralUnion<string>, string>) => {
    const userToUpdate = users!.find((user) => user.id === values.id);
    if (userToUpdate) {
      userToUpdate.name.first = values["name.first"];
      userToUpdate.name.last = values["name.last"];
      userToUpdate.email = values.email;
      userToUpdate.accessibility = values.accessibility;
      updateMutation.mutate(userToUpdate);
    }
  };

  const handleDeleteAction = (row: MRT_Row<IUser>) => {
    setPersonToDelete(users![row.index]);
    setDeleteModalVisible(true);
  };

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(() => columnsList, []);

  const table = useMaterialReactTable({
    columns: columns,
    data: users || [],
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
      <UserTableAction table={table} row={row} onDelete={handleDeleteAction} />
    ),
  });

  const handleUserDelete = (confirmed: boolean) => {
    if (confirmed) {
      deleteMutation.mutate(personToDelete!.id);
      users!.filter((person) => person.id !== personToDelete!.id);
    }
    setPersonToDelete(undefined);
    setDeleteModalVisible(false);
  };

  const handleSelectionClick = () => {
    const rowIndexed = Object.keys(rowSelection).map((key) => parseInt(key));
    const userIds1 = [];

    for (let i = 0; i < rowIndexed.length; i++) {
      userIds1.push(users![rowIndexed[i]].id);
      users![rowIndexed[i]].role = selectedRole;
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
      <DeleteUserModal
        open={deleteModalVisible}
        handleClose={handleUserDelete}
      />
      <MaterialReactTable table={table} />;
      <NotifyUser
        open={snackbarMessage == null ? false : true}
        message={snackbarMessage!}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

const columnsList = [
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
];
