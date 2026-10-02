import { expect, makeTestUser, signUpViaApi, test } from './helpers'

test.describe('locale routing', () => {
  test('the locale prefix survives the ABAC redirect chain', async ({ page }) => {
    await page.goto('/zh-TW/dashboard')

    await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
  })

  test('switching locale via the LocaleSwitcher changes rendered text and the URL', async ({
    page,
  }) => {
    await page.goto('/sign-in')
    const cardTitle = page.locator('[data-slot="card-title"]')
    await expect(cardTitle).toHaveText('Sign in')

    const toggle = page.getByRole('button', { name: 'Change language' })
    await toggle.click()
    await expect(toggle).toHaveAttribute('data-open', 'true')

    await page.getByRole('button', { name: '中', exact: true }).click()

    await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
    await expect(cardTitle).toHaveText('登入')
  })

  test('an unsupported locale segment does not leak the real page to an authenticated visitor', async ({
    page,
    context,
  }) => {
    const user = makeTestUser('locale-bad-segment')
    await signUpViaApi(context, user)

    await page.goto('/not-a-real-locale/dashboard')

    await expect(page.getByText('Not Found')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Welcome,/ })).not.toBeVisible()
  })

  test('an unsupported locale segment 404s on a route outside _authenticated too', async ({
    page,
    context,
  }) => {
    // The beforeLoad check that guards this covers the whole {-$locale} subtree (see the
    // comment on {-$locale}/route.tsx), not only the branch _authenticated happens to share a
    // route-tree node with -- this pins that down on /sign-in, which sits directly under
    // {-$locale} rather than under _authenticated, where a fix narrowly scoped to
    // _authenticated's own branch would still pass every other test in this file.
    //
    // This needs an authenticated visitor: for an unauthenticated one, the root route's own
    // ABAC guard (already covered by abac-guard.spec.ts) redirects any path that isn't an
    // exact literal match for a configured public/auth route -- including this one, since the
    // unsupported locale segment is still attached to the path ABAC sees -- before this
    // beforeLoad ever runs. That's a real, independent safety net (no leak either way, just a
    // redirect instead of a 404), but it means an unauthenticated visit here would pass this
    // test for a reason that has nothing to do with the fix this test exists to pin down.
    const user = makeTestUser('locale-bad-segment-public-route')
    await signUpViaApi(context, user)

    await page.goto('/not-a-real-locale/sign-in')

    await expect(page.getByText('Not Found')).toBeVisible()
  })
})
