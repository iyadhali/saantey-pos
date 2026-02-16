import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PurchasingHome from "@/pages/purchasing/home";
import OrdersList from "@/pages/purchasing/orders";
import { TestWrapper } from "../test-utils";

describe("Purchasing Edge Cases", () => {
  describe("Orders List", () => {
    it("renders filter controls", () => {
      render(
        <TestWrapper>
          <OrdersList />
        </TestWrapper>
      );
      
      expect(screen.getByPlaceholderText(/Search PO/i)).toBeInTheDocument();
      expect(screen.getByText("New PO")).toBeInTheDocument();
    });
    
    it("displays order table headers", () => {
      render(
        <TestWrapper>
          <OrdersList />
        </TestWrapper>
      );
      
      expect(screen.getByText("PO ID")).toBeInTheDocument();
      expect(screen.getByText("Vendor")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });
  });

  describe("Purchasing Home", () => {
    it("shows quick actions", () => {
      render(
        <TestWrapper>
          <PurchasingHome />
        </TestWrapper>
      );
      
      expect(screen.getByText("New Purchase Order")).toBeInTheDocument();
      expect(screen.getByText("Unfinalized Invoices")).toBeInTheDocument();
    });
  });
});
