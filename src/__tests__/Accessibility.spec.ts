import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AccessibilityView from '@/views/AccessibilityView.vue'
import LegalNoticeView from '@/views/LegalNoticeView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import SiteMapView from '@/views/SiteMapView.vue'

async function findViolations(component: Parameters<typeof mount>[0]) {
  document.body.innerHTML = ''
  const wrapper = mount(component, {
    attachTo: document.body,
    global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
  })
  const results = await axe.run(wrapper.element, {
    // jsdom ne calcule pas les styles et contrastes : ceux-ci exigent un audit dans un vrai navigateur.
    rules: { 'color-contrast': { enabled: false } },
  })
  wrapper.unmount()
  return results.violations
}

describe('Pages réglementaires', () => {
  it.each([
    ['accessibilité', AccessibilityView],
    ['mentions légales', LegalNoticeView],
    ['vie privée', PrivacyView],
    ['plan du site', SiteMapView],
  ])('ne présente pas de violation axe détectable : %s', async (_name, component) => {
    expect(await findViolations(component)).toEqual([])
  })
})
