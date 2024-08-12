import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";

type DeleteUserProps = {
  open: boolean;
  handleClose: (confirmed: boolean) => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DeleteUserModal = (props: DeleteUserProps) => {
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Do you really want to delete this entry?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          It will not be possible to restore the data in the future.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleClose(false)}>Disagree</Button>
        <Button onClick={() => props.handleClose(true)}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
};
