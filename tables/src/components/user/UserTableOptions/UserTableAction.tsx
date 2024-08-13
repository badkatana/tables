import { Box, IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { MRT_Row, MRT_TableInstance } from "material-react-table";
import { IUser } from "../../../interfaces/IUser";

type UserTableActionProps = {
  onDelete: (row: MRT_Row<IUser>) => void;
  row: MRT_Row<IUser>;
  table: MRT_TableInstance<IUser>;
};

export const UserTableAction = (props: UserTableActionProps) => {
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
