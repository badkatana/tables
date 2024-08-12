import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { IUser } from "../../interfaces/IUser";
import { useMutation, useQuery } from "react-query";
import { IRole, IRoleTable } from "../../interfaces/IRole";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { Box, Button, IconButton } from "@mui/material";
import { RoleEditModalWindow } from "./RoleModalWindow";
import { createRole, editRole } from "../../http/functions";

type RoleTableProps = {
  projectName: string;
  users: IUser[];
};

export const RoleTable = (props: RoleTableProps) => {
  const columns = useMemo<MRT_ColumnDef<IRoleTable>[]>(
    () => [
      {
        accessorKey: "roleId",
        header: "ID",
        enableEditing: false,
        enableSotring: false,
      },
      {
        accessorKey: "roleName",
        header: "Role",
        muiEditTextFieldProps: {
          required: true,
          type: "string",
          variant: "outlined",
        },
      },
      {
        accessorKey: "usersArray",
        header: "Users",
        enableEditing: false,
      },
      {
        accessorKey: "description",
        header: "Description",
        muiEditTextFieldProps: {
          required: true,
          type: "string",
          variant: "outlined",
        },
      },
    ],
    []
  );

  const [editingRole, setEditingRole] = useState<MRT_Row<IRoleTable>>();
  const { data: roles } = useQuery<IRole[]>(["roles"]);
  const { data: users } = useQuery<IUser[]>(["users"]);

  const insertBetween = (ele: string, array: string[]) => {
    return array.flatMap((x) => [ele, x]).slice(1);
  };

  const createMutation = useMutation((newRole: IRole) => createRole(newRole));

  const editMutation = useMutation((editedRole: IRole) => editRole(editedRole));
  const proccessedData = useMemo(() => {
    if (users == null || users!.length < 0) return [];
    if (roles == null || roles!.length < 0) return [];
    const dataToDisplay: IRoleTable[] = [];
    for (let i = 0; i < roles.length; i++) {
      const roleRow: IRoleTable = {
        roleId: roles[i].roleId,
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
  }, [users, roles]);

  const handleCreateRole = (values: any) => {
    const newRole: IRole = {
      roleId: roles == null ? 1 : roles!.slice(-1)[0].roleId + 1,
      roleName: values.roleName,
      description: values.description,
    };
    createMutation.mutate(newRole);
  };

  const handleEditRole = (values: any) => {
    const editedRole: IRole = {
      roleId: editingRole!.original.roleId,
      roleName: values.roleName,
      description: values.description,
    };
    console.log(editedRole);
    editMutation.mutate(editedRole);
  };

  const table = useMaterialReactTable({
    columns: columns,
    data: proccessedData || [],
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    state: { columnVisibility: { roleId: false } },
    enableRowActions: true,
    positionActionsColumn: "last",
    onEditingRowSave: ({ table, values }) => {
      handleEditRole(values);
      table.setEditingRow(null);
    },
    onCreatingRowSave: ({ table, values }) => {
      handleCreateRole(values);
      table.setCreatingRow(null);
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
        <IconButton
          onClick={() => {
            setEditingRole(row);
            table.setEditingRow(row);
          }}
        >
          <CreateRoundedIcon />
        </IconButton>
        <IconButton onClick={() => {}}>
          <DeleteOutlineRoundedIcon />
        </IconButton>
      </Box>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <RoleEditModalWindow
        table={table}
        row={row}
        message={`Edit Role ${row.original.roleName}`}
        fieldsToExclude={["roleId", "user"]}
        fields={internalEditComponents}
      />
    ),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <RoleEditModalWindow
        table={table}
        row={row}
        message={`Create a new role`}
        fieldsToExclude={["roleId", "user"]}
        fields={internalEditComponents}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Role
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};
