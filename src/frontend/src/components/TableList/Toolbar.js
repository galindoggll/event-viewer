import { Toolbar as MToolbar } from "@material-ui/core";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from "prop-types";
import React, {useState} from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import DeleteDialog from "./DeleteDialog";

Toolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

function Toolbar(props) {
  const classes = useToolbarStyles();
  const { title, selected, handleDelete, handleEdit, isLoading } = props;
  const numSelected = selected.length;
  const editSelected = () => {
    selected.length === 1 && handleEdit(selected[0]);
  };
  // Toggle value for delete dialog
  const [open, setOpen] = useState(false);
  const deleteSelected = () => {
    setOpen(true);
  };
  const handleClose = (isDelete) => {
    setOpen(false);
    isDelete && handleDelete(selected);
  };

  return (
    <MToolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <DeleteDialog
        isOpen={open}
        handleClose={handleClose}
        selectedCount={selected.length}
      />
      {
        numSelected > 0 ?
          <Typography className={classes.title} color="inherit" variant="h5" component="div">
            {numSelected} selected
          </Typography>:
          <Typography className={classes.title} variant="h3" id="tableTitle" component="div">
            {title}
          </Typography>
      }

      {
        numSelected === 1 &&
          <Tooltip title="Edit">
            <IconButton aria-label="edit" onClick={isLoading ? () => {} : editSelected}>
              <EditIcon />
            </IconButton>
          </Tooltip>
      }

      {
        numSelected > 0 &&
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={isLoading ? () => {} : deleteSelected}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
      }
    </MToolbar>
  );
}

export default Toolbar;
