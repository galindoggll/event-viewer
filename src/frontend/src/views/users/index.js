import React, { useState } from 'react';
import { Page } from 'components';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import List from './List';
import AddEditDialog from "./AddEditDialog";
import { readUser, clearModalValues, changeSearchCriteria } from 'services/users';
import { useDispatch, useSelector } from "react-redux";
import {searchUser} from "../../services/users";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Grid from "@material-ui/core/Grid";
import {useFormHandler} from "../../utils/hooks";
import reeValidate from "ree-validate";

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1, 2),
    margin: theme.spacing(3),
  },
  searchBar: {
    width: 'auto',
    display: 'inline-block',
    '& button': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    '& input': {
      paddingLeft: theme.spacing(1),
    },
  },
  actionContainer: {
    textAlign: 'right',
  },
}));

function Users() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const onEdit = (selectedId) => {
    dispatch(readUser(selectedId)).then(() => {
      setOpen(true);
    });
  };
  // For search parameters
  const keyword = useSelector(state => state.users.search.keyword);
  const limit = useSelector(state => state.users.search.limit);
  const page = useSelector(state => state.users.search.page);
  const sort = useSelector(state => state.users.search.sort);
  const sortBy = useSelector(state => state.users.search.sortBy);
  // Initial values to be feed to the dialog
  const initialValues = useSelector(state => ({
    id: state.users.modalValues.id,
    first_name: state.users.modalValues.firstName,
    last_name: state.users.modalValues.lastName,
    email: state.users.modalValues.email,
    avatar: state.users.modalValues.avatar,
    status: state.users.modalValues.status,
    password: state.users.modalValues.password,
  }));
  // Closes the dialog
  const closeDialog = (hasAddedOrEdit = false) => {
    hasAddedOrEdit && dispatch(searchUser(keyword, page, limit, sort, sortBy));
    setOpen(false);
    dispatch(clearModalValues());
  };
  const [formState, handleChange, submitForm] = useFormHandler(new reeValidate({'keyword':''}));
  const onSearch = event => {
    event.preventDefault();
    submitForm(() => {
      dispatch(changeSearchCriteria(formState.values.keyword, page, limit, sort, sortBy));
    });
  };

  return (
    <Page title="Users">
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Grid item xs={12} className={classes.actionContainer}>
          <Paper component='form' className={classes.searchBar} onSubmit={onSearch}>
            <InputBase
              className={classes.input}
              placeholder="Search"
              name='keyword'
              value={formState.values.keyword}
              onChange={handleChange}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add User
          </Button>
        </Grid>
      </Grid>
      <List
        handleEdit={onEdit}
        keyword={keyword}
        page={page}
        limit={limit}
        sort={sort}
        sortBy={sortBy}
      />
      <AddEditDialog
        initialValues={initialValues}
        open={open}
        handleClose={closeDialog}
      />
    </Page>
  );
}

export default Users;
