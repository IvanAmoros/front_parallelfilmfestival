import { render, screen } from '@testing-library/react';

function Dummy() {
  return <div>Hello World</div>;
}

test('renders dummy component', () => {
  render(<Dummy />);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});
