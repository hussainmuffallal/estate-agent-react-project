import "@testing-library/jest-dom";
import { vi } from "vitest";
import { mockProperties } from "./mockProperties";

beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockProperties)
    })
  );
});

afterEach(() => {
  vi.clearAllMocks();
});
