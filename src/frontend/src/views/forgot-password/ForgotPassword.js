import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import ReeValidate from 'ree-validate';
import Alert from '@material-ui/lab/Alert';
import {
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { Page } from 'components';
import { useFormHandler } from 'utils/hooks';
import { sendForgotPasswordEmail } from 'services/auth';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    marginTop: theme.spacing(3),
  },
  error: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  submitButton: {
    margin: theme.spacing(2, 0),
  },
}));

const validator = new ReeValidate({
  email: 'required|email',
});

function ForgotPassword() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, handleChange, submitForm, hasError] = useFormHandler(
    validator,
  );

  const handleSubmit = event => {
    event.preventDefault();

    submitForm(() => {
      setLoading(true);

      dispatch(sendForgotPasswordEmail(formState.values))
        .then(() => {
          setSuccess(true);
        })
        .catch(e => {
          if (e.response.data.error) {
            const error = e.response.data.error;

            validator.errors.add('email', error);
          }
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <Page title="Forgot Password" className={classes.root}>
      <form onSubmit={handleSubmit}>
        {success && (
          <div>
            <Alert variant="outlined" severity="success">
              Submitted! <br />
              Your password has been successfully reset. You should be receiving
              an email shortly with an instruction.
            </Alert>

            <br />

            <Typography color="textSecondary" variant="body1">
              Have an account?{' '}
              <Link component={RouterLink} to="/sign-in" variant="h6">
                Sign In
              </Link>
            </Typography>
          </div>
        )}

        {!success && (
          <>
            <Typography className={classes.title} variant="h2">
              Forgot Password
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Enter your email address.
            </Typography>
            <TextField
              className={classes.textField}
              error={hasError('email')}
              helperText={
                hasError('email') ? formState.errors.first('email') : null
              }
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <Button
              className={classes.submitButton}
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {loading && <CircularProgress size="1.5rem" />}
              {!loading && 'Submit'}
            </Button>

            <Typography color="textSecondary" variant="body1">
              Go back to{' '}
              <Link component={RouterLink} to="/sign-in" variant="h6">
                Sign in
              </Link>
            </Typography>
          </>
        )}
      </form>
    </Page>
  );
}

export default ForgotPassword;
