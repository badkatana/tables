import { Box, Slide, Snackbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";

type NotifyUserProps = {
  message: string;
  open: boolean;
  onClose: () => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const NotifyUser = (props: NotifyUserProps) => {
  return (
    <>
      <Snackbar
        open={props.open}
        onClose={props.onClose}
        autoHideDuration={3000}
        TransitionComponent={Transition}
        message={props.message}
      />
    </>
  );
};
