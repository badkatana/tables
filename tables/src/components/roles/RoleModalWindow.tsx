import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import {
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { forwardRef, ReactElement, ReactNode, Ref, useState } from "react";
import { IRoleTable } from "../../interfaces/IRole";
import { Rowing } from "@mui/icons-material";

type RoleEditModalProps = {
  table: MRT_TableInstance<IRoleTable>;
  row: MRT_Row<IRoleTable>;
  fields: ReactNode[];
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RoleEditModalWindow = (props: RoleEditModalProps) => {
  return (
    <>
      <DialogTitle>{"Do you really want to delete this entry?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box>{props.fields.map((field) => field)}</Box>
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
