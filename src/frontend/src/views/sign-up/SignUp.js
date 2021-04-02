import React, { useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import reeValidate from 'ree-validate';

import { useFormHandler } from 'utils/hooks';
import { signUpUser } from 'services/auth';
import { Page } from 'components';

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
  signUpButton: {
    margin: theme.spacing(2, 0),
  },
}));

export const userValidations = {
  first_name: 'required',
  last_name: 'required',
  email: 'required|email',
  password: 'required|min:8',
};

const validator = new reeValidate(userValidations);

function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, handleChange, submitForm, hasError] = useFormHandler(
    validator,
  );

  const handleSignUp = event => {
    event.preventDefault();

    submitForm(() => {
      setLoading(true);

      dispatch(signUpUser(formState.values))
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

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Page title="Sign Up" className={classes.root}>
      <form onSubmit={handleSignUp}>
        {success && (
          <div>
            <Alert variant="outlined" severity="success">
              Congratulations! <br />
              You have successfully created your account. You should be
              receiving an email shortly with an instruction.
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
              Create new account
            </Typography>

            <TextField
              className={classes.textField}
              error={hasError('first_name')}
              fullWidth
              helperText={
                hasError('first_name')
                  ? formState.errors.first('first_name')
                  : null
              }
              label="First Name"
              name="first_name"
              onChange={handleChange}
              type="text"
              value={formState.values.first_name || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('last_name')}
              fullWidth
              helperText={
                hasError('last_name')
                  ? formState.errors.first('last_name')
                  : null
              }
              label="Last Name"
              name="last_name"
              onChange={handleChange}
              type="text"
              value={formState.values.last_name || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.first('email') : null
              }
              label="Email Address"
              name="email"
              onChange={handleChange}
              type="email"
              value={formState.values.email || ''}
              variant="outlined"
            />
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
            <Button
              className={classes.signUpButton}
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {loading && <CircularProgress size="1.5rem" />}
              {!loading && 'Sign Up'}
            </Button>

            <Typography color="textSecondary" variant="body1">
              Have an account?{' '}
              <Link component={RouterLink} to="/sign-in" variant="h6">
                Sign In
              </Link>
            </Typography>
          </>
        )}
      </form>
    </Page>
  );
}

SignUp.propTypes = {
  history: PropTypes.object,
};

export default SignUp;
