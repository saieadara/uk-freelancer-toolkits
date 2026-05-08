"""Manual Playwright regression steps for Startup Toolkit frontend flows."""


async def run_startup_toolkit_checks(page):
    await page.set_viewport_size({"width": 1920, "height": 1080})
    await page.wait_for_selector('[data-testid="main-navigation-header"]', timeout=10000)
    await page.get_by_test_id("nav-link-startup-toolkit").click(force=True)
    await page.wait_for_url("**/startup", timeout=10000)
    await page.get_by_test_id("startup-primary-business-plan-cta").click(force=True)
    await page.wait_for_url("**/startup/business-plan-generator", timeout=10000)
    await page.wait_for_selector('[data-testid="input-business-plan-companyName"]', timeout=10000)
    await page.get_by_test_id("input-business-plan-companyName").fill("TEST Nova Labs 2026")
    await page.wait_for_timeout(300)
    await page.get_by_test_id("business-plan-page-title-Cover").inner_text()
    async with page.expect_download(timeout=20000):
        await page.get_by_test_id("business-plan-download-docx-button").click(force=True)
    async with page.expect_download(timeout=40000):
        await page.get_by_test_id("business-plan-download-pdf-button").click(force=True)
