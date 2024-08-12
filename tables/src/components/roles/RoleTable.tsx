import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { IUser } from "../../interfaces/IUser";
import { useQuery } from "react-query";
import { IRole, IRoleTable } from "../../interfaces/IRole";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { Box, IconButton } from "@mui/material";
import { RoleEditModalWindow } from "./RoleModalWindow";

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

  const { data: roles } = useQuery<IRole[]>(["roles"]);
  const { data: users } = useQuery<IUser[]>(["users"]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(true);

  const handleCloseEditModal = (roleName: string, description: string) => {
    setEditModalOpen(false);
    console.log(editModalOpen);
  };

  const insertBetween = (ele: string, array: string[]) => {
    return array.flatMap((x) => [ele, x]).slice(1);
  };

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

  const table = useMaterialReactTable({
    columns: columns,
    data: proccessedData || [],
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: { columnVisibility: { roleId: false } },
    enableRowActions: true,
    positionActionsColumn: "last",
    onEditingRowSave: ({ table, values }) => {
      console.log(values);
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
        <IconButton onClick={() => {}}>
          <DeleteOutlineRoundedIcon />
        </IconButton>
      </Box>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <RoleEditModalWindow
        table={table}
        row={row}
        fieldsToExclude={["roleId", "user"]}
        fields={internalEditComponents}
      />
    ),
  });

  return <MaterialReactTable table={table} />;
};
