import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  textDisplay: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export default function DeleteDialog(props) {
  const classes = useStyles();
  const { isOpen, handleClose, selectedCount } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => { handleClose(false) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={'xs'}
      fullWidth={true}
    >
      <DialogTitle>Delete</DialogTitle>
      <DialogContent dividers>
        <DialogContentText className={classes.textDisplay}>
          Confirm to delete <b>{selectedCount} item{selectedCount > 1 && 's'}</b>.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={() => handleClose(true)} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
