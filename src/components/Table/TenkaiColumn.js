import React from 'react';
import { Button } from 'react-bootstrap';

export const addId = (wdt = '10%') => {
  return addCol('ID', 'ID', wdt);
};

export const addEdit = (onEdit, wdt = '10%', disabled = false) => {
  return addColBtn(
    'edit',
    'Edit',
    renderBtn(onEdit, 'pe-7s-edit', disabled),
    wdt
  );
};

export const addDelete = (onDelete, wdt = '10%', disabled = false) => {
  return addColBtn(
    'delete',
    'Delete',
    renderBtn(onDelete, 'pe-7s-trash', disabled),
    wdt
  );
};

export const addViewItems = (onItems, wdt = '10%') => {
  return addColBtn('items', 'Items', renderBtn(onItems, 'pe-7s-album'), wdt);
};

export const addCol = (dataField, text, wdt = '10%') => {
  return {
    dataField: dataField,
    text: text,
    sort: true,
    headerStyle: {
      width: wdt
    }
  };
};

export const addColBtn = (dataField, text, button, wdt = '10%') => {
  return {
    dataField: dataField,
    text: text,
    sort: false,
    isDummyField: true,
    formatter: button,
    headerStyle: {
      width: wdt
    }
  };
};

export const addColCheckbox = (dataField, text, button, wdt = '2%') => {
  return {
    dataField: dataField,
    text: text,
    sort: false,
    isDummyField: true,
    formatter: button,
    headerStyle: {
      width: wdt
    }
  };
};

export const renderBtn = (handleEvt, icon, disabled = false) => {
  return (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={handleEvt.bind(this, row)}
        disabled={disabled}
      >
        <i className={icon + ' cell-button-icon'} />
      </Button>
    );
  };
};
