import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMenuStore } from '~~/stores/menu'
import type { MenuIngredientLine } from '~~/stores/menu'

describe('useMenuStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty drafts', () => {
    const store = useMenuStore()
    expect(store.menuDrafts).toEqual({})
  })

  it('createMenuDraft() returns an ID and creates draft in store', () => {
    const store = useMenuStore()
    const id = store.createMenuDraft()

    expect(id).toMatch(/^MENU-DRAFT-/)
    expect(store.menuDrafts[id]).toBeDefined()
    expect(store.menuDrafts[id]!.name).toBe('New Menu Item')
    expect(store.menuDrafts[id]!.category).toBe('Mains')
    expect(store.menuDrafts[id]!.active).toBe(true)
    expect(store.menuDrafts[id]!.sellingPrice).toBe(0)
    expect(store.menuDrafts[id]!.lines).toEqual([])
  })

  it('updateMenuDraft() patches draft fields', () => {
    const store = useMenuStore()
    const id = store.createMenuDraft()

    store.updateMenuDraft(id, { name: 'Cheeseburger', sellingPrice: 16.00 })

    expect(store.menuDrafts[id]!.name).toBe('Cheeseburger')
    expect(store.menuDrafts[id]!.sellingPrice).toBe(16.00)
    // Other fields unchanged
    expect(store.menuDrafts[id]!.category).toBe('Mains')
  })

  it('addLine() appends ingredient line', () => {
    const store = useMenuStore()
    const id = store.createMenuDraft()

    const line: MenuIngredientLine = {
      id: 'line-1',
      inventoryItemId: 'ITM-001',
      name: 'Whole Milk',
      vendorId: 'V-001',
      unitCost: 4.50,
      qty: 2,
      unit: 'GAL',
    }

    store.addLine(id, line)

    expect(store.menuDrafts[id]!.lines).toHaveLength(1)
    expect(store.menuDrafts[id]!.lines[0]!).toEqual(line)
  })

  it('updateLine() patches specific line by ID', () => {
    const store = useMenuStore()
    const draftId = store.createMenuDraft()

    store.addLine(draftId, {
      id: 'line-1',
      inventoryItemId: 'ITM-001',
      name: 'Whole Milk',
      vendorId: 'V-001',
      unitCost: 4.50,
      qty: 2,
      unit: 'GAL',
    })
    store.addLine(draftId, {
      id: 'line-2',
      inventoryItemId: 'ITM-002',
      name: 'Eggs',
      vendorId: 'V-001',
      unitCost: 0.25,
      qty: 3,
      unit: 'EA',
    })

    store.updateLine(draftId, 'line-1', { qty: 5, unitCost: 4.00 })

    expect(store.menuDrafts[draftId]!.lines[0]!.qty).toBe(5)
    expect(store.menuDrafts[draftId]!.lines[0]!.unitCost).toBe(4.00)
    // line-2 unchanged
    expect(store.menuDrafts[draftId]!.lines[1]!.qty).toBe(3)
  })

  it('removeLine() filters out line by ID', () => {
    const store = useMenuStore()
    const draftId = store.createMenuDraft()

    store.addLine(draftId, {
      id: 'line-1',
      inventoryItemId: 'ITM-001',
      name: 'Whole Milk',
      vendorId: 'V-001',
      unitCost: 4.50,
      qty: 2,
      unit: 'GAL',
    })
    store.addLine(draftId, {
      id: 'line-2',
      inventoryItemId: 'ITM-002',
      name: 'Eggs',
      vendorId: 'V-001',
      unitCost: 0.25,
      qty: 3,
      unit: 'EA',
    })

    store.removeLine(draftId, 'line-1')

    expect(store.menuDrafts[draftId]!.lines).toHaveLength(1)
    expect(store.menuDrafts[draftId]!.lines[0]!.id).toBe('line-2')
  })

  it('addLine() is a no-op if draft does not exist', () => {
    const store = useMenuStore()
    store.addLine('non-existent', {
      id: 'line-1',
      inventoryItemId: 'ITM-001',
      name: 'Milk',
      vendorId: 'V-001',
      unitCost: 4.50,
      qty: 1,
      unit: 'GAL',
    })
    expect(Object.keys(store.menuDrafts)).toHaveLength(0)
  })
})
