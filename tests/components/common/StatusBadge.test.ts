import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatusBadge from '~/components/common/StatusBadge.vue'

describe('StatusBadge', () => {
  it('renders badge with correct text', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Finalized' },
    })
    expect(wrapper.text()).toContain('Finalized')
  })

  it('applies success variant for "Finalized"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Finalized' },
    })
    expect(wrapper.html()).toContain('emerald')
  })

  it('applies warning variant for "Pending"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Pending' },
    })
    expect(wrapper.html()).toContain('amber')
  })

  it('applies error variant for "Rejected"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Rejected' },
    })
    expect(wrapper.html()).toContain('red')
  })

  it('applies draft variant for "Draft"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Draft' },
    })
    expect(wrapper.html()).toContain('slate')
  })

  it('applies info variant for "Open"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Open' },
    })
    expect(wrapper.html()).toContain('blue')
  })

  it('defaults to neutral for unknown status', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Custom' },
    })
    expect(wrapper.html()).toContain('slate')
  })
})
