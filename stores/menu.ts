export type MenuIngredientLine = {
  id: string
  inventoryItemId: string
  name: string
  vendorId: string
  unitCost: number
  qty: number
  unit: string
  imageSrc?: string
}

export type MenuItemDraft = {
  id: string
  name: string
  category: string
  active: boolean
  imageSrc?: string
  sellingPrice: number
  lines: MenuIngredientLine[]
}

export const useMenuStore = defineStore('menu', () => {
  const menuDrafts = ref<Record<string, MenuItemDraft>>({})

  function createMenuDraft(): string {
    const id = `MENU-DRAFT-${String(Date.now())}`
    menuDrafts.value[id] = {
      id,
      name: 'New Menu Item',
      category: 'Mains',
      active: true,
      sellingPrice: 0,
      lines: [],
    }
    return id
  }

  function updateMenuDraft(id: string, patch: Partial<MenuItemDraft>) {
    const draft = menuDrafts.value[id]
    if (!draft) return
    menuDrafts.value[id] = { ...draft, ...patch }
  }

  function addLine(menuId: string, line: MenuIngredientLine) {
    const draft = menuDrafts.value[menuId]
    if (!draft) return
    draft.lines.push(line)
  }

  function updateLine(menuId: string, lineId: string, patch: Partial<MenuIngredientLine>) {
    const draft = menuDrafts.value[menuId]
    if (!draft) return
    const idx = draft.lines.findIndex(l => l.id === lineId)
    if (idx !== -1) {
      Object.assign(draft.lines[idx]!, patch)
    }
  }

  function removeLine(menuId: string, lineId: string) {
    const draft = menuDrafts.value[menuId]
    if (!draft) return
    draft.lines = draft.lines.filter(l => l.id !== lineId)
  }

  return {
    menuDrafts,
    createMenuDraft,
    updateMenuDraft,
    addLine,
    updateLine,
    removeLine,
  }
})
