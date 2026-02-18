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

  it('applies success color for "Finalized"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Finalized' },
    })
    expect(wrapper.html()).toContain('success')
  })

  it('applies warning color for "Pending"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Pending' },
    })
    expect(wrapper.html()).toContain('warning')
  })

  it('applies error color for "Rejected"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Rejected' },
    })
    expect(wrapper.html()).toContain('error')
  })

  it('applies neutral color for "Draft"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Draft' },
    })
    // Draft uses neutral color with outline variant
    expect(wrapper.html()).toContain('ring-accented')
  })

  it('applies info color for "Open"', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Open' },
    })
    expect(wrapper.html()).toContain('info')
  })

  it('defaults to neutral for unknown status', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'Custom' },
    })
    expect(wrapper.html()).toContain('ring-accented')
  })
})
