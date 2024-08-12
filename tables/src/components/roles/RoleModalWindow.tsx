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
import {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useEffect,
  useState,
} from "react";
import { IRoleTable } from "../../interfaces/IRole";

type RoleEditModalProps = {
  table: MRT_TableInstance<IRoleTable>;
  message?: string;
  row: MRT_Row<IRoleTable>;
  fields: ReactNode[];
  fieldsToExclude: string[];
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
