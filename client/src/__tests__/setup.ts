import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock resize observer which is not available in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/", vi.fn()],
    useParams: () => ({}),
  };
});
