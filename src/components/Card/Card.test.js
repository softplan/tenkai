import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';

import CardTenkai from './CardTenkai';

afterEach(cleanup);

describe('CardTenkai Component', () => {
  it('Should render the component', () => {
    const { container } = createComponent();
    expect(container).toBeDefined();
  });

  it('Should unmount the component', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CardTenkai />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

function createComponent(props = {}) {
  const defaultProps = {
    ...props
  };

  return render(<CardTenkai {...defaultProps} />);
}
