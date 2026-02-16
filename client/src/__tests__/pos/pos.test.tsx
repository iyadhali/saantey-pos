import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import POSHome from "@/pages/pos/home";
import { TestWrapper } from "../test-utils";

describe("POS Module Edge Cases", () => {
  describe("Table Map", () => {
    it("renders tables with correct status indicators", () => {
      render(
        <TestWrapper>
          <POSHome />
        </TestWrapper>
      );
      
      // Occupied table
      const occupiedTables = screen.getAllByText("Occupied");
      expect(occupiedTables.length).toBeGreaterThan(0);
      
      // Dirty table (Edge Case: Needs cleaning)
      expect(screen.getByText("Dirty")).toBeInTheDocument();
      // Reserved table
      expect(screen.getByText("Reserved")).toBeInTheDocument();
    });

    it("displays guest counts for occupied tables", () => {
      render(
        <TestWrapper>
          <POSHome />
        </TestWrapper>
      );
      
      // Expect at least one guest count (e.g., "2 guests")
      const guestCounts = screen.getAllByText(/guests/i);
      expect(guestCounts.length).toBeGreaterThan(0);
    });
  });
});
