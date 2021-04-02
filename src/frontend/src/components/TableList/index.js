import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from './Toolbar';
import Head from './Head';
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";

TableList.propTypes = {
  title: PropTypes.string.isRequired,
  headCells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.isRequired,
    numeric: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    display: PropTypes.array,
  }).isRequired).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.isRequired,
  })).isRequired,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  sort: PropTypes.oneOf(['asc', 'desc']),
  sortBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  pageSizes: PropTypes.array,
  totalCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageSizeChange: PropTypes.func,
  handleSort: PropTypes.func,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

TableList.defaultProps = {
  pageSize: 10,
  currentPage: 1,
  pageSizes: [5, 10, 50],
  sort: 'asc',
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    borderRadius: '0',
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function TableList(props) {
  const classes = useStyles();
  const {
    title,
    headCells,
    data,
    pageSize,
    currentPage,
    handlePageChange,
    handlePageSizeChange,
    pageSizes,
    totalCount,
    isLoading,
    sort,
    handleSort,
    handleDelete,
    handleEdit
  } = props;
  const sortBy = props.sortBy || 'id';
  // Selected rows
  const [selected, setSelected] = useState([]);
  // Minus 1 for the current page because pagination component is zero based
  const page = currentPage - 1;

  const handleRequestSort = (event, property) => {
    setSelected([]);
    const isAsc = sortBy === property && sort === 'asc';
    handleSort(isAsc ? 'desc' : 'asc', property);
  };
  const handleChangePage = (event, newPage) => {
    setSelected([]);
    // +1 since the newPage is zero based value (zero(0) for first page)
    handlePageChange(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value);

    if (pageSize !== newPageSize) {
      setSelected([]);
      handlePageSizeChange instanceof Function && handlePageSizeChange(newPageSize);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let selection = data.map((n) => n.id);
      setSelected(selection);
      return;
    }

    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };
  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  };
  const deleteAction = (selectedIds) => {
    handleDelete(selectedIds);
    setSelected([]);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar
          selected={selected}
          title={title}
          handleEdit={handleEdit}
          handleDelete={deleteAction}
          isLoading={isLoading}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="table list"
          >
            <Head
              classes={classes}
              numSelected={selected.length}
              order={sort}
              orderBy={sortBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              headCells={headCells}
              isLoading={isLoading}
            />
            <TableBody>
              {
                !isLoading &&
                  data.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        { createCells(headCells, row, isItemSelected, labelId) }
                      </TableRow>
                    );
                  })
              }
              {
                isLoading &&
                  <TableRow style={{ height: 53 * pageSize }}>
                    <TableCell colSpan={6} align={'center'}> { /* TODO colspan fix it */ }
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={pageSizes}
          component="div"
          count={totalCount}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={isLoading ? () => {} : handleChangePage}
          onChangeRowsPerPage={isLoading ? () => {} : handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

function createCells(headCells, rowData, isItemSelected, labelId) {
  let cells = [];

  // Add checkbox column
  cells.push(
    <TableCell padding="checkbox" key={labelId}>
      <Checkbox
        checked={isItemSelected}
        inputProps={{ 'aria-labelledby': labelId }}
      />
    </TableCell>
  );

  // Iterate thru the headCells, this will be the basis for the display of data
  for (let i = 0; i < headCells.length; i++) {
    const headCell = headCells[i];

    // Process only shown columns
    if (headCell.hide !== true) {
      // Default display value is base from the column ID
      let value = rowData[headCell.id];

      // Value is an object, we need to get the specific value for display
      if (headCell.display !== undefined && typeof value === "object") {
        // Iterate to all given indeces and value to be the value of the last index
        for (let ii = 0; ii < headCell.display.length; ii++) {
          value = value[headCell.display[ii]];
        }
      }

      cells.push(
        <TableCell key={`${headCell.id}-${rowData.id}`}>{value}</TableCell>
      );
    }
  }

  return cells;
}

export default TableList;
