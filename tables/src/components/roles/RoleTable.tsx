import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { useMutation } from "react-query";
import { IRole } from "../../interfaces/IRole";
import { RoleEditModalWindow } from "./RoleModalWindow";
import { createRole, editRole } from "../../http/roleAPI";
import { useRoles } from "../../hooks/useRoles";
import { RoleTableToolbar } from "./RoleTableToolbar";
import { RoleTableActions } from "./RoleTableAction";

export const RoleTable = () => {
  const columns = useMemo<MRT_ColumnDef<IRole>[]>(() => columnsList, []);
  const createMutation = useMutation((newRole: IRole) => createRole(newRole));
  const editMutation = useMutation((editedRole: IRole) => editRole(editedRole));
  const { roles } = useRoles();

  const handleCreateRole = (values: {
    roleName: string;
    description: string;
  }) => {
    const newRole: IRole = {
      roleId: roles == null ? 1 : roles!.slice(-1)[0].roleId + 1,
      roleName: values.roleName,
      description: values.description,
    };
    createMutation.mutate(newRole);
  };

  const handleEditRole = (
    values: {
      roleName: string;
      description: string;
    },
    row: MRT_Row<IRole>
  ) => {
    const editedRole: IRole = {
      roleId: row.original.roleId,
      roleName: values.roleName,
      description: values.description,
    };
    editMutation.mutate(editedRole);
  };

  const table = useMaterialReactTable({
    columns: columns,
    data: roles || [],
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableRowActions: true,
    state: { columnVisibility: { roleId: false } },
    positionActionsColumn: "last",
    onEditingRowSave: ({ table, values, row }) => {
      handleEditRole(values, row);
      table.setEditingRow(null);
    },
    onCreatingRowSave: ({ table, values }) => {
      handleCreateRole(values);
      table.setCreatingRow(null);
    },
    renderRowActions: ({ row }) => <RoleTableActions table={table} row={row} />,
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
      <RoleTableToolbar table={table} />
    ),
  });

  return <MaterialReactTable table={table} />;
};

const columnsList: MRT_ColumnDef<IRole>[] = [
  {
    accessorKey: "roleId",
    header: "ID",
    enableEditing: false,
  },
  {
    accessorKey: "roleName",
    header: "Role",
  },
  {
    accessorKey: "usersArray",
    header: "Users",
    enableEditing: false,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
