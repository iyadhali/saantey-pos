import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InvoicesList from "@/pages/purchasing/invoices";
import { TestWrapper } from "../test-utils";

describe("Invoices Edge Cases", () => {
  describe("Invoice List", () => {
    it("shows import and new invoice actions", () => {
      render(
        <TestWrapper>
          <InvoicesList />
        </TestWrapper>
      );
      
      expect(screen.getByText("Import")).toBeInTheDocument();
      expect(screen.getByText("New Invoice")).toBeInTheDocument();
    });

    it("renders correct columns", () => {
      render(
        <TestWrapper>
          <InvoicesList />
        </TestWrapper>
      );
      
      expect(screen.getByText("Invoice ID")).toBeInTheDocument();
      expect(screen.getByText("Delivery Date")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });
  });
});
