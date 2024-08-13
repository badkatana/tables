import { MRT_TableInstance } from "material-react-table";
import { IRole } from "../../interfaces/IRole";
import { Button } from "@mui/material";

export const RoleTableToolbar = (props: {
  table: MRT_TableInstance<IRole>;
}) => {
  return (
    <Button
      variant="outlined"
      onClick={() => {
        props.table.setCreatingRow(true);
      }}
    >
      Create New Role
    </Button>
  );
};
