import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import Topbar from './components/Topbar';
import { Loader, Notification } from 'components';
import { hideNotification } from 'store/notification/actionCreators';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 64,
    height: '100%',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    height: '100%',
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300,
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white,
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
}));

function Minimal(props) {
  const { children } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loader);
  const notification = useSelector(state => state.notification);

  return (
    <div className={classes.root}>
      {loading && <Loader />}
      <Topbar />

      <Notification
        message={notification.message}
        open={notification.show}
        onClose={() => dispatch(hideNotification())}
        success={notification.success}
      />

      <main className={classes.content}>
        <Grid className={classes.grid} container>
          <Grid className={classes.quoteContainer} item lg={7}>
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography className={classes.quoteText} variant="h1">
                  Providing interactive and innovative solutions globally.
                </Typography>
                <div className={classes.person}>
                  <Typography className={classes.name} variant="body1">
                    Made with ♥
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className={classes.content} item lg={5} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentBody}>{children}</div>
            </div>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

Minimal.propTypes = {
  children: PropTypes.node,
};

export default Minimal;
