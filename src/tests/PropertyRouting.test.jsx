import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test("loads property page when navigating to /property/3", () => {
    render(
        <MemoryRouter initialEntries={['/property/3']}>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText("Property 3")).toBeInTheDocument();
});

test("shows error for invalid property id", () => {
  render(
    <MemoryRouter initialEntries={["/property/999"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/not found/i)).toBeInTheDocument();
});