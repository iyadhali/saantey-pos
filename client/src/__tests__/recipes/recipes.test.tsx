import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RecipesHome from "@/pages/recipes/home";
import RecipeDetail from "@/pages/recipes/detail";
import { TestWrapper } from "../test-utils";

// Mock useParams to simulate different routes
import * as wouter from "wouter";

describe("Recipe Module Edge Cases", () => {
  describe("Recipe List", () => {
    it("renders food cost alerts", () => {
      render(
        <TestWrapper>
          <RecipesHome />
        </TestWrapper>
      );
      
      // Check for columns
      expect(screen.getByText("Food Cost %")).toBeInTheDocument();
    });
  });

  describe("Recipe Builder (New Mode)", () => {
    it("initializes with empty state for new recipe", () => {
      // Mock params for "new"
      vi.spyOn(wouter, "useParams").mockReturnValue({ id: "new" });

      render(
        <TestWrapper>
          <RecipeDetail />
        </TestWrapper>
      );
      
      expect(screen.getByText("New Recipe")).toBeInTheDocument();
      expect(screen.getByText("DRAFT")).toBeInTheDocument();
      expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    });
  });
});
