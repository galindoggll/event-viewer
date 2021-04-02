import React, { useState, useEffect } from 'react';
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
import queryString from 'query-string';

import { Page } from 'components';
import { useFormHandler } from 'utils/hooks';
import { resetPassword } from 'services/auth';

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
  password: 'required|min:8',
  password_confirmation: 'required|min:8',
  token: '',
});

function ResetPassword(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, handleChange, submitForm, hasError] = useFormHandler(
    validator,
  );

  useEffect(() => {
    const token = queryString.parse(props.location.search).token;

    formState.values.token = token || 'invalid_token';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = event => {
    event.preventDefault();

    submitForm(() => {
      setLoading(true);

      dispatch(resetPassword(formState.values))
        .then(() => {
          setSuccess(true);
        })
        .catch(e => {
          if (e.response.data.error) {
            const error = e.response.data.error;

            Object.keys(error).forEach(value => {
              validator.errors.add(value, error[value][0]);
            });
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
              You have successfully updated your password. You should be able to
              login with your updated password.
              <Link component={RouterLink} to="/sign-in" variant="h6">
                Click here to login.
              </Link>
            </Alert>
          </div>
        )}

        {!success && (
          <>
            <Typography className={classes.title} variant="h2">
              Update Password
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Enter your new password
            </Typography>
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.first('password') : null
              }
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('password_confirmation')}
              fullWidth
              helperText={
                hasError('password_confirmation')
                  ? formState.errors.first('password_confirmation')
                  : null
              }
              label="Confirm Password"
              name="password_confirmation"
              onChange={handleChange}
              type="password"
              value={formState.values.password_confirmation || ''}
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

export default ResetPassword;
