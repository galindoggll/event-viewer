import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
  link: {
    textDecoration: 'none',
  },
  title: {
    flexGrow: 1,
    color: theme.palette.white,
  },
}));

function Topbar(props) {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <Link to="/" className={classes.link}>
          <Typography variant="h4" className={classes.title}>
            Sprobe Base Template
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
