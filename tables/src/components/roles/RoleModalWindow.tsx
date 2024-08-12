import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { ReactNode, useEffect, useState } from "react";
import { IRole } from "../../interfaces/IRole";

type RoleEditModalProps = {
  table: MRT_TableInstance<IRole>;
  message?: string;
  row: MRT_Row<IRole>;
  fields: ReactNode[];
  fieldsToExclude: string[];
};

export const RoleEditModalWindow = (props: RoleEditModalProps) => {
  const [fields1, setFields] = useState<ReactNode[]>([]);

  useEffect(() => {
    const excludedFields = props.fields.filter((field) => {
      const key = (field as React.ReactElement).key;
      return !props.fieldsToExclude.some((exclude) => key?.includes(exclude));
    });

    setFields(excludedFields);
  }, [props.fields, props.fieldsToExclude]);

  return (
    <>
      <DialogTitle>{props.message ?? "Modal for Role"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box>{fields1.map((field) => field)}</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons
          variant="text"
          table={props.table}
          row={props.row}
        />
      </DialogActions>
    </>
  );
};
