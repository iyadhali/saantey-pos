import { create } from "zustand";

export type MenuIngredientLine = {
  id: string;
  inventoryItemId: string;
  name: string;
  vendorId: string;
  unitCost: number;
  qty: number;
  unit: string;
  imageSrc?: string;
};

export type MenuItemDraft = {
  id: string;
  name: string;
  category: string;
  active: boolean;
  imageSrc?: string;
  sellingPrice: number;
  lines: MenuIngredientLine[];
};

type MenuStoreState = {
  menuDrafts: Record<string, MenuItemDraft>;
  createMenuDraft: () => string;
  updateMenuDraft: (id: string, patch: Partial<MenuItemDraft>) => void;
  addLine: (menuId: string, line: MenuIngredientLine) => void;
  updateLine: (menuId: string, lineId: string, patch: Partial<MenuIngredientLine>) => void;
  removeLine: (menuId: string, lineId: string) => void;
};

export const useMenuStore = create<MenuStoreState>((set) => ({
  menuDrafts: {},
  createMenuDraft: () => {
    const id = `MENU-DRAFT-${String(Date.now())}`;
    set((s) => ({
      menuDrafts: {
        ...s.menuDrafts,
        [id]: {
          id,
          name: "New Menu Item",
          category: "Mains",
          active: true,
          sellingPrice: 0,
          lines: [],
        },
      },
    }));
    return id;
  },
  updateMenuDraft: (id, patch) =>
    set((s) => ({
      menuDrafts: {
        ...s.menuDrafts,
        [id]: {
          ...s.menuDrafts[id],
          ...patch,
        },
      },
    })),
  addLine: (menuId, line) =>
    set((s) => {
      const draft = s.menuDrafts[menuId];
      if (!draft) return s;
      return {
        menuDrafts: {
          ...s.menuDrafts,
          [menuId]: {
            ...draft,
            lines: [...draft.lines, line],
          },
        },
      };
    }),
  updateLine: (menuId, lineId, patch) =>
    set((s) => {
      const draft = s.menuDrafts[menuId];
      if (!draft) return s;
      return {
        menuDrafts: {
          ...s.menuDrafts,
          [menuId]: {
            ...draft,
            lines: draft.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
          },
        },
      };
    }),
  removeLine: (menuId, lineId) =>
    set((s) => {
      const draft = s.menuDrafts[menuId];
      if (!draft) return s;
      return {
        menuDrafts: {
          ...s.menuDrafts,
          [menuId]: {
            ...draft,
            lines: draft.lines.filter((l) => l.id !== lineId),
          },
        },
      };
    }),
}));
