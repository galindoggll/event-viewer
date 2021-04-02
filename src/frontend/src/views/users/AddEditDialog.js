import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ImageIcon from '@material-ui/icons/ImageOutlined';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/styles";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {CircularProgress} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import { useFormHandler } from "../../utils/hooks";
import { userValidations } from 'views/sign-up/SignUp';
import _ from 'lodash';
import { useDispatch } from "react-redux";
import { createUser, updateUser } from 'services/users';
import { actionSetModalValues } from 'store/users/actionCreators';
import reeValidate from 'ree-validate';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => {
  return {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      padding: theme.spacing(1),
    },
    modalTitle: {
      margin: 0,
      padding: theme.spacing(2),
    },
    loader: {
      marginRight: theme.spacing(1),
    },
    fieldContainer: {
      marginBottom: theme.spacing(2),
    },
    fileInput: {
      display: 'none',
    },
    imageContainer: {
      paddingLeft: theme.spacing(3),
    },
    status: {
      fontWeight: 'bold',
      textTransform: 'uppercase',
      paddingLeft: theme.spacing(1),
    },
    avatarIcon: {
      height: 'auto',
      width: '100%',
      cursor: 'pointer',
    },
    avatarButton: {
      display: 'block',
      height: '100%',
      width: '100%',
      '& button': {
        height: '100%',
        width: '100%',
        '& span': {
          margin: 0,
        },
      },
    },
  };
});

AddEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

const validator = new reeValidate({
  ...userValidations,
  avatar: 'image',
});

export default function AddEditDialog(props) {
  const classes = useStyles();
  const {open, initialValues, handleClose} = props;
  const isNew = initialValues.id === 0;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const index = _.findIndex(validator.fields.items, ['name', 'password']);
  let passwordField = validator.fields.items[index];

  if (!isNew) {
    // For update users, password is not required
    delete passwordField.rules.required;
  } else if (isNew && !passwordField.rules.required) {
    // For new users, password is required
    passwordField.rules = {
      required: [],
      ...passwordField.rules,
    }
  }

  // Put it back
  validator.fields.items[index] = passwordField;

  const [formState, handleChange, submitForm, hasError, clearErrors] = useFormHandler(
    validator,
    initialValues
  );

  const onClose = () => {
    clearErrors();
    handleClose();
  };

  const onSubmit = () => {
    submitForm(() => {
      setLoading(true);
      dispatch(actionSetModalValues(formState.values));

      const dispatched = isNew ?
        dispatch(createUser(formState.values)) :
        dispatch(updateUser(formState.values, initialValues.id));

      dispatched
        .then(() => {
          handleClose(true);
        })
        .catch(e => {
          const errors = e.response.data.error;
          Object.keys(errors).forEach(value => {
            validator.errors.add(value, errors[value][0]);
          });
        }).finally(() => {
          setLoading(false);
        });
    });
  };

  const imageDisplay = () => {
    // There's an avatar set
    if (formState.values.avatar.length > 0) {
      switch (typeof formState.values.avatar) {
        case 'string':
          return <img
            src={formState.values.avatar}
            alt=''
            className={classes.avatarIcon}
          />;
        case 'object':
          if (!hasError('avatar')) {
            return <img
              src={URL.createObjectURL(formState.values.avatar[0])}
              alt=''
              className={classes.avatarIcon}
            />;
          }
      }
    }

    return <ImageIcon color='primary' className={classes.avatarIcon} />;
  };

  return (
    <Dialog
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
      onClose={() => onClose()}
      open={open}
      maxWidth={'sm'}
      fullWidth={true}
    >
      <MuiDialogTitle
        className={classes.modalTitle}
        disableTypography
      >
        <Typography variant="h3">
          {isNew ? 'Add' : 'Update'} User
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onClose()}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent dividers>
        <Grid container>
          <Grid container item xs={isNew ? 12 : 8}>
            <Grid className={classes.fieldContainer} item xs={12}>
              <TextField
                value={formState.values.first_name}
                error={hasError('first_name')}
                helperText={hasError('first_name') && formState.errors.first('first_name')}
                name='first_name'
                label="First Name"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid className={classes.fieldContainer} item xs={12}>
              <TextField
                value={formState.values.last_name}
                error={hasError('last_name')}
                helperText={hasError('last_name') && formState.errors.first('last_name')}
                name='last_name'
                label="Last Name"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid className={classes.fieldContainer} item xs={12}>
              <TextField
                value={formState.values.email}
                error={hasError('email')}
                helperText={hasError('email') && formState.errors.first('email')}
                name='email'
                label="Email"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid className={classes.fieldContainer} item xs={12}>
              <TextField
                type='password'
                value={formState.values.password}
                error={hasError('password')}
                helperText={hasError('password') && formState.errors.first('password')}
                name='password'
                label="Password"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          {
            !isNew &&
              <Grid
                xs={4}
                item
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.imageContainer}
              >
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.fileInput}
                    id="avatar"
                    type="file"
                    name='avatar'
                    onChange={handleChange}
                  />
                  <Tooltip title='Select image.'>
                    <label color='primary' htmlFor="avatar">
                      {imageDisplay()}
                    </label>
                  </Tooltip>
                  {
                    hasError('avatar') &&
                      <FormHelperText error={true}>
                        { formState.errors.first('avatar') }
                      </FormHelperText>
                  }
                </Grid>
                <Grid item xs={12} container alignItems="flex-end">
                  <Typography align='center' component='span'>Status: </Typography>
                  <Typography align='center' component='span' className={classes.status}>
                    {initialValues.status.name}
                  </Typography>
                </Grid>
              </Grid>
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => onClose()}
          disabled={loading}
          color='primary'
        >
          Close
        </Button>
        <Button
          disabled={loading}
          color='primary'
          variant='contained'
          onClick={onSubmit}
          disableElevation
        >
          {loading && <CircularProgress size={24} className={classes.loader} />}
          {isNew ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
