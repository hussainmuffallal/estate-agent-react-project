import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PropertyPage from "../pages/PropertyPage";

test("loads property page when navigating to /property/3", () => {
  render(
    <MemoryRouter initialEntries={["/property/3"]}>
      <Routes>
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/property/i)).toBeInTheDocument();
});

test("shows error for invalid property id", () => {
  render(
    <MemoryRouter initialEntries={["/property/999"]}>
      <Routes>
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/not found|invalid/i)).toBeInTheDocument();
});
