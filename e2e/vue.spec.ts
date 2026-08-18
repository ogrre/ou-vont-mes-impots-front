import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('présente la navigation principale', async ({ page }) => {
  await page.route('**/api/v1/state-expenditure**', async (route) => route.fulfill({
    json: {
      period: 2025, scope: { code: 'french_state_budget', label: 'Budget de l’État français' },
      status: 'executed', flow_type: 'expenditure', measure: { code: 'payment_credit', official_label: 'CP' },
      classification: 'mission', currency: 'EUR', total: '1000000.00',
      percentage_denominator: { amount: '1000000.00', description: 'Même périmètre' },
      items: [],
      source: { dataset: { id: 'test', name: 'Test', publication_title: null, publication_date: null, source_url: null, download_url: null, downloaded_at: null, license: { name: null, url: null }, publication_ready: false }, publisher: { name: null, source_name: 'Test', homepage_url: null, official: true }, file: { descriptor: 'test', filename: 'test.csv', checksum_sha256: 'abc' }, import: { batch_id: 1, completed_at: null, rows_read: 0, observations_imported: 0 } },
    },
  }))
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Où va l’argent')
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toContainText(
    'Les recettes',
  )
})
