import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';

import { activateUser } from 'services/auth';
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
}));

function Activate(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = queryString.parse(props.location.search).token;

    if (token) {
      dispatch(activateUser(token))
        .then(() => {
          setSuccess(true);
        })
        .catch(e => {
          setError(e.response.data.error);
        });
    } else {
      setError('Invalid token');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page title="Activate Account" className={classes.root}>
      {success && (
        <Alert variant="outlined" severity="success">
          You have successfully activated your account. You should be able to
          login with your email and password.
          <Link component={RouterLink} to="/sign-in" variant="h6">
            Click here to login.
          </Link>
        </Alert>
      )}

      {error && (
        <Alert variant="outlined" severity="error">
          {error}
        </Alert>
      )}
    </Page>
  );
}

export default Activate;
