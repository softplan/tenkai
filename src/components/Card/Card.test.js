import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';

import Card from './Card';

afterEach(cleanup);

describe('Card Component', () => {
  it('Should render the component', () => {
    const { container } = createComponent();
    expect(container).toBeDefined();
  });

  it('Should unmount the component', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Card />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

function createComponent(props = {}) {
  const defaultProps = {
    ...props
  };

  return render(<Card {...defaultProps} />);
}
