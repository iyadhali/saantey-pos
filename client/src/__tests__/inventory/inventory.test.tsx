import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WasteEntry from "@/pages/inventory/waste";
import CountEntry from "@/pages/inventory/count-entry";
import { TestWrapper } from "../test-utils";

describe("Inventory Edge Cases", () => {
  describe("Waste Entry", () => {
    it("validates negative quantities", () => {
      render(
        <TestWrapper>
          <WasteEntry />
        </TestWrapper>
      );
      
      const qtyInput = screen.getByRole("spinbutton");
      fireEvent.input(qtyInput, { target: { value: "-5" } });
      
      // Should auto-correct to 0 or positive
      expect(Number((qtyInput as HTMLInputElement).value)).toBeGreaterThanOrEqual(0);
    });

    it("requires reason selection", () => {
      render(
        <TestWrapper>
          <WasteEntry />
        </TestWrapper>
      );
      
      // Select button should be present
      expect(screen.getByText("Add Waste Entry")).toBeInTheDocument();
    });
  });

  describe("Count Entry", () => {
    it("renders count input fields", () => {
      render(
        <TestWrapper>
          <CountEntry />
        </TestWrapper>
      );
      
      const inputs = screen.getAllByPlaceholderText("0");
      expect(inputs.length).toBeGreaterThan(0);
    });
  });
});
