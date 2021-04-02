import React, { useEffect } from "react";
import { TableList } from "components";
import { useSelector, useDispatch } from "react-redux";
import { searchUser, changeSearchCriteria, deleteUser } from "services/users";
import PropTypes from 'prop-types';

List.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  sort: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
};

function List(props) {
  const dispatch = useDispatch();
  const { handleEdit, keyword, page, limit, sort, sortBy } = props;

  // List details
  const list = useSelector(state => state.users.list);
  const totalCount = useSelector(state => state.users.listMeta.totalCount);

  const isLoading = useSelector(state => state.loader);

  useEffect(() => {
    dispatch(searchUser(keyword, page, limit, sort, sortBy));
  }, [dispatch, keyword, page, limit, sort, sortBy]);

  const headerCells = [
    { id: "id", numeric: true, label: 'ID', hide: true },
    { id: 'last_name', numeric: false, label: 'Last Name' },
    { id: 'first_name', numeric: false, label: 'First Name' },
    { id: 'email', numeric: false, label: 'Email' },
    { id: 'status', numeric: false, label: 'Status', display: ['name'] },
  ];

  const handlePageChange = (newPage) => {
    dispatch(changeSearchCriteria(keyword, newPage, limit, sort, sortBy));
  };

  const handlePageSizeChange = (pageSize) => {
    // Since it's a change in page size, let's reset page at first page.
    dispatch(changeSearchCriteria(keyword, 1, pageSize, sort, sortBy));
  };

  const handleSort = (order, orderBy) => {
    dispatch(changeSearchCriteria(keyword, page, limit, order, orderBy));
  };

  const btnDeleteAction = (selectedIds) => {
    dispatch(deleteUser(selectedIds)).then(() => {
      dispatch(searchUser(keyword, page, limit, sort, sortBy));
    });
  };

  const btnEditAction = (selectedId) => {
    handleEdit(selectedId);
  };

  return (
    <TableList
      title={`Assassins`}
      headCells={headerCells}
      data={list}
      pageSize={limit}
      totalCount={totalCount}
      handlePageChange={handlePageChange}
      handlePageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
      handleSort={handleSort}
      sort={sort}
      sortBy={sortBy}
      currentPage={page}
      handleDelete={btnDeleteAction}
      handleEdit={btnEditAction}
    />
  )
}

export default List;
