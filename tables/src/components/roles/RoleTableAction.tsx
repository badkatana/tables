import { Box, IconButton } from "@mui/material";
import { MRT_Row, MRT_TableInstance } from "material-react-table";
import { IRole } from "../../interfaces/IRole";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { useMutation } from "react-query";
import { deleteRole } from "../../http/roleAPI";

export const RoleTableActions = (props: {
  table: MRT_TableInstance<IRole>;
  row: MRT_Row<IRole>;
}) => {
  const deleteMutation = useMutation((roleId: string) => deleteRole(roleId));
  return (
    <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
      <IconButton
        onClick={() => {
          props.table.setEditingRow(props.row);
        }}
      >
        <CreateRoundedIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          deleteMutation.mutate(props.row.original.roleId.toString());
        }}
      >
        <DeleteOutlineRoundedIcon />
      </IconButton>
    </Box>
  );
};
