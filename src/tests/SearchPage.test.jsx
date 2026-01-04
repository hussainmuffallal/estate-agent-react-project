import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPage from "../pages/SearchPage";
import { BrowserRouter } from "react-router-dom";

// Mock data
const mockProperties = {
  properties: [
    {
      id: 1,
      title: "3 Bedroom Semi-Detached Family Home",
      type: "house",
      bedrooms: 3,
      price: 750000,
      location: "Petts Wood Road, Orpington BR5",
      postcode: "BR5",
      dateAdded: "2022-10-12",
      images: ["images/property1/1.jpg"],
      floorPlan: "/images/property1/floorplan.jpg",
      coordinates: { lat: 51.3892, lng: 0.0744 }
    },
    {
      id: 2,
      title: "2 Bedroom Garden Flat",
      type: "flat",
      bedrooms: 2,
      price: 399995,
      location: "Crofton Road, Orpington BR6",
      postcode: "BR5",
      dateAdded: "2022-09-14",
      images: ["images/property2/1.jpg"],
      floorPlan: "/images/property2/floorplan.jpg",
      coordinates: { lat: 51.3735, lng: 0.0646 }
    }
  ]
};


// Helper to render page
const renderPage = () =>
  render(
    <BrowserRouter>
      <SearchPage />
    </BrowserRouter>
  );

// Clear localStorage and mock fetch before each test
beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockProperties)
    })
  );
});

// Test-1: Page renders correctly
test("renders Search Page heading", () => {
  renderPage();
  expect(screen.getByText(/search page/i)).toBeInTheDocument();
});

// Test-2: Add property to favourites
test("adds a property to favourites", async () => {
  renderPage();
  const user = userEvent.setup();
  const buttons = await screen.findAllByText(/add to favourites/i);

  // Add first property to favourites
  await user.click(buttons[0]);

  // Check inside favourites section only
  const favouritesSection = screen.getByTestId("favourites");
  expect(within(favouritesSection).getByText(/£750,000/i)).toBeInTheDocument();
});


// Test-3: Prevent duplicate favourites
test("prevents duplicate favourites", async () => {
  renderPage();
  const user = userEvent.setup();
  const buttons = await screen.findAllByText(/add to favourites/i);

  // Click the same property twice
  await user.click(buttons[0]);
  await user.click(buttons[0]);

  const favouritesSection = screen.getByTestId("favourites");
  const prices = within(favouritesSection).getAllByText(/£/);

  // Ensure only 1 instance in favourites
  expect(prices.length).toBe(1);
});


// Test-4: Remove favourite using button
test("removes a favourite", async () => {
  renderPage();
  const user = userEvent.setup();
  const buttons = await screen.findAllByText(/add to favourites/i);

  // Add property
  await user.click(buttons[0]);

  // Remove it
  const favouritesSection = screen.getByTestId("favourites");
  const removeBtn = within(favouritesSection).getByRole("button", { name: /remove/i });
  await user.click(removeBtn);

  expect(screen.getByText(/no favourites yet/i)).toBeInTheDocument();
});


// Test-5: Clear favourites
test("clears all favourites", async () => {
  renderPage();
  const user = userEvent.setup();
  const buttons = await screen.findAllByText(/add to favourites/i);

  // Add both properties
  await user.click(buttons[0]);
  await user.click(buttons[1]);

  // Clear favourites
  const clearBtn = await screen.findByText(/clear favourites/i);
  await user.click(clearBtn);

  expect(screen.getByText(/no favourites yet/i)).toBeInTheDocument();
});


// // Test-6: Persist favourites using localStorage (Distinction test)
// test("loads favourites from localStorage on reload", () => {
//   localStorage.setItem(
//     "favourites",
//     JSON.stringify([{ id: 1, title: "Test Property", price: 100000 }])
//   );

//   renderPage();

//   expect(screen.getByText(/test property/i)).toBeInTheDocument();
// });

