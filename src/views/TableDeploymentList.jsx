import React, { useState, useEffect } from 'react';
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

  return (
    <BootstrapTable
      remote
      bootstrap4
      striped
      hover
      condensed
      keyField="ID"
      data={data}
      columns={props.columns}
      pagination={paginationFactory(options)}
      onTableChange={handleTableChange}
    />
  );
};

export default TableDeploymentList;
