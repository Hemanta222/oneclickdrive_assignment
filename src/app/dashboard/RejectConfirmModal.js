import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

const RejectConfirmModal = ({ rejectItem, closeModal, open }) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reject this item?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to set the status as <b>Reject</b> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>No</Button>
          <Button
            onClick={() => {
              rejectItem();
              closeModal();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default RejectConfirmModal;
