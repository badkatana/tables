import { Box, IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { MRT_Row, MRT_TableInstance } from "material-react-table";
import { IRole } from "../../interfaces/IRole";
import { IUser } from "../../interfaces/IUser";

type TableActionButtonProps = {
  onDelete: (row: MRT_Row<IUser>) => void;
  row: MRT_Row<IUser>;
  table: MRT_TableInstance<IUser>;
};

export const TableActionButton = (props: TableActionButtonProps) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
      <IconButton
        onClick={() => {
          props.table.setEditingRow(props.row);
        }}
      >
        <CreateRoundedIcon />
      </IconButton>
      <IconButton onClick={() => props.onDelete(props.row)}>
        <DeleteOutlineRoundedIcon />
      </IconButton>
    </Box>
  );
};
