import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import _RecipesParent from '~/pages/recipes.vue'
import RecipesOverview from '~/pages/recipes/overview.vue'
import MenuItemsList from '~/pages/recipes/menu/index.vue'
import PrepItems from '~/pages/recipes/prep.vue'

describe('Recipes Parent Layout', () => {
  it('renders "Recipes" heading', async () => {
    const wrapper = await mountSuspended(RecipesOverview)
    expect(wrapper.text()).toContain('Recipes')
  })

  it('renders tab navigation', async () => {
    const wrapper = await mountSuspended(RecipesOverview)
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Menu Items')
    expect(wrapper.text()).toContain('Prep Items')
  })
})

describe('Recipes Overview', () => {
  it('renders KPI cards', async () => {
    const wrapper = await mountSuspended(RecipesOverview)
    expect(wrapper.text()).toContain('Menu Items')
    expect(wrapper.text()).toContain('Prep Items')
    expect(wrapper.text()).toContain('Raw Items')
  })

  it('renders recipe summary', async () => {
    const wrapper = await mountSuspended(RecipesOverview)
    expect(wrapper.text()).toContain('Total Recipes')
  })

  it('renders recipe data', async () => {
    const wrapper = await mountSuspended(RecipesOverview)
    expect(wrapper.text()).toContain('Cheeseburger')
    expect(wrapper.text()).toContain('Caesar Salad')
  })
})

describe('Menu Items List', () => {
  it('renders menu items', async () => {
    const wrapper = await mountSuspended(MenuItemsList)
    expect(wrapper.text()).toContain('Cheeseburger')
  })

  it('renders New Menu Item button', async () => {
    const wrapper = await mountSuspended(MenuItemsList)
    expect(wrapper.text()).toContain('New Menu Item')
  })
})

describe('Prep Items', () => {
  it('renders prep items from inventory', async () => {
    const wrapper = await mountSuspended(PrepItems)
    expect(wrapper.text()).toContain('Burger Patty (Prep)')
    expect(wrapper.text()).toContain('House Mayo')
  })

  it('renders New Prep Recipe button', async () => {
    const wrapper = await mountSuspended(PrepItems)
    expect(wrapper.text()).toContain('New Prep Recipe')
  })
})
