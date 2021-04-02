import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[500],
    justifyContent: 'center',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

function Notification(props) {
  const { message, open, onClose, success } = props;
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <SnackbarContent
        className={success ? classes.success : classes.error}
        message={message}
      />
    </Snackbar>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
};

export default Notification;
