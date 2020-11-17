import React, { useState, useEffect } from 'react';
import * as col from 'components/Table/TenkaiColumn';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const TableDeploymentList = props => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data);
    setTotalSize(props.count);
  }, [props]);

  const handleTableChange = (_type, { page, sizePerPage }) => {
    setPage(page);
    setSizePerPage(sizePerPage);
    props.onLoad(page, sizePerPage);
  };

  const options = {
    onSizePerPageChange: (sizePerPage, page) => {
      setPage(page);
      setSizePerPage(sizePerPage);
      props.onLoad(page, sizePerPage);
    },
    onPageChange: (page, sizePerPage) => {
      setPage(page);
      setSizePerPage(sizePerPage);
      props.onLoad(page, sizePerPage);
    },
    page,
    sizePerPage,
    totalSize
  };

  let columns = [];
  columns.push(col.addCol('ID', 'Request Ids', '15%'));
  columns.push(col.addCol('chart', 'Chart', '40%'));
  columns.push(col.addCol('CreatedAt', 'Created At', '15%'));
  columns.push(col.addCol('UpdatedAt', 'Updated At', '15%'));
  columns.push(col.addCol('success', 'Success', '15%'));

  return (
    <BootstrapTable
      remote
      bootstrap4
      striped
      hover
      condensed
      keyField="ID"
      data={data}
      columns={columns}
      pagination={paginationFactory(options)}
      onTableChange={handleTableChange}
    />
  );
};

export default TableDeploymentList;
