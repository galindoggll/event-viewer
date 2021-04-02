import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ReeValidate from 'ree-validate';
import { Redirect } from 'react-router-dom';

import { useFormHandler } from 'utils/hooks';
import { signInUser } from 'services/auth';
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
  signInButton: {
    margin: theme.spacing(2, 0),
  },
  forgotPassword: {
    float: 'right',
  },
}));

const validator = new ReeValidate({
  username: 'required|email',
  password: 'required',
});

function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [formState, handleChange, submitForm, hasError] = useFormHandler(
    validator,
  );

  const handleSignIn = event => {
    event.preventDefault();

    submitForm(() => dispatch(signInUser(formState.values)));
  };

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Page title="Sign In" className={classes.root}>
      <form onSubmit={handleSignIn}>
        <Typography className={classes.title} variant="h2">
          Sign In
        </Typography>
        <TextField
          className={classes.textField}
          error={hasError('username')}
          helperText={
            hasError('username') ? formState.errors.first('username') : null
          }
          fullWidth
          label="Username"
          name="username"
          onChange={handleChange}
          type="text"
          value={formState.values.username || ''}
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          error={hasError('password')}
          helperText={
            hasError('password') ? formState.errors.first('password') : null
          }
          fullWidth
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={formState.values.password || ''}
          variant="outlined"
        />
        {auth.signInFailed && auth.error && (
          <Typography className={classes.error} color="error" variant="h6">
            {auth.error.message}
          </Typography>
        )}
        <Button
          className={classes.signInButton}
          color="primary"
          disabled={auth.isPending}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {auth.isPending && <CircularProgress size="1.5rem" />}
          {!auth.isPending && 'Sign in'}
        </Button>

        <Typography color="textSecondary" variant="body1">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/sign-up" variant="h6">
            Sign up
          </Link>
          <Link
            component={RouterLink}
            className={classes.forgotPassword}
            to="/forgot-password"
            variant="h6"
          >
            Forgot password?
          </Link>
        </Typography>
      </form>
    </Page>
  );
}

SignIn.propTypes = {
  history: PropTypes.object,
};

export default SignIn;
