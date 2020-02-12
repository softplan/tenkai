import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export const addEdit = (onEdit, wdt = '10%') => {
  return addColBtn('edit', 'Edit', renderBtn(onEdit, 'pe-7s-edit'), wdt);
};

export const addDelete = (onDelete, wdt = '10%') => {
  return addColBtn('delete', 'Delete', renderBtn(onDelete, 'pe-7s-trash'), wdt);
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

function renderBtn(handleEvt, icon) {
  return (cell, row) => {
    return (
      <Button className="link-button" onClick={handleEvt.bind(this, row)}>
        <i className={icon} />
      </Button>
    );
  };
}
