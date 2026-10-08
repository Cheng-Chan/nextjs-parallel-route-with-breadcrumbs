import { expect, test, type Page } from "@playwright/test";

type ExpectedLink = Readonly<{
  label: string;
  href: string;
}>;

type ExpectedBreadcrumb = Readonly<{
  trail: string;
  current: string;
  links: readonly ExpectedLink[];
}>;

const dashboardLink = { label: "Dashboard", href: "/dashboard" } as const;
const usersLink = { label: "Users", href: "/dashboard/users" } as const;
const waterVendingLink = {
  label: "Water Vending",
  href: "/dashboard/water-vending",
} as const;

async function expectBreadcrumb(
  page: Page,
  expected: ExpectedBreadcrumb,
) {
  const navbar = page.locator('[data-app-navbar="true"]');
  const breadcrumb = navbar.getByRole("navigation", { name: "Breadcrumb" });
  const current = breadcrumb.locator('[aria-current="page"]');
  const links = breadcrumb.getByRole("link");

  await expect(navbar).toHaveCount(1);
  await expect(breadcrumb).toHaveAttribute(
    "data-breadcrumb-trail",
    expected.trail,
  );
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(expected.current);
  expect(await current.evaluate((element) => element.tagName)).not.toBe("A");
  await expect(links).toHaveCount(expected.links.length);
  expect(
    await links.evaluateAll((elements) =>
      elements.map((element) => ({
        label: element.textContent?.trim() ?? "",
        href: element.getAttribute("href") ?? "",
      })),
    ),
  ).toEqual(expected.links);
  await expect(breadcrumb.locator('li[aria-hidden="true"]')).toHaveCount(
    expected.trail.split(" > ").length - 1,
  );
}

async function expectBreadcrumbSource(
  page: Page,
  source: "catch-all" | "explicit",
) {
  const sourceMarker = page.locator("[data-breadcrumb-source]");

  if (source === "catch-all") {
    await expect(sourceMarker).toHaveCount(1);
    await expect(sourceMarker).toHaveAttribute(
      "data-breadcrumb-source",
      "catch-all",
    );
    return;
  }

  await expect(sourceMarker).toHaveCount(0);
}

async function expectSlowNavigation(
  page: Page,
  navigate: () => Promise<void>,
  expected: ExpectedBreadcrumb,
  contentLoadingSelector = '[data-user-loading="true"]',
  catchAllLoading = false,
) {
  await navigate();

  const loadingBreadcrumb = page.locator(
    '[data-breadcrumb-loading="true"]',
  );
  await expect(loadingBreadcrumb).toBeVisible();
  await expect(loadingBreadcrumb).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(contentLoadingSelector)).toBeVisible();
  await expect(page.locator("[data-breadcrumb-trail]")).toHaveCount(0);
  if (catchAllLoading) {
    await expect(
      page.locator('[data-breadcrumb-source="catch-all-loading"]'),
    ).toBeVisible();
  }

  await expectBreadcrumb(page, expected);
  await expect(loadingBreadcrumb).toHaveCount(0);
}

test.describe("parallel-route breadcrumbs", () => {
  test("directly loads every valid static and dynamic route", async ({ page }) => {
    const routes: ReadonlyArray<
      Readonly<{
        path: string;
        expected: ExpectedBreadcrumb;
        source: "catch-all" | "explicit";
      }>
    > = [
      {
        path: "/dashboard",
        expected: { trail: "Dashboard", current: "Dashboard", links: [] },
        source: "explicit",
      },
      {
        path: "/dashboard/users",
        expected: {
          trail: "Dashboard > Users",
          current: "Users",
          links: [dashboardLink],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/users/create",
        expected: {
          trail: "Dashboard > Users > Create",
          current: "Create",
          links: [dashboardLink, usersLink],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/users/123",
        expected: {
          trail: "Dashboard > Users > Sokha",
          current: "Sokha",
          links: [dashboardLink, usersLink],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/users/123/edit",
        expected: {
          trail: "Dashboard > Users > Sokha > Edit",
          current: "Edit",
          links: [
            dashboardLink,
            usersLink,
            { label: "Sokha", href: "/dashboard/users/123" },
          ],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/users/456",
        expected: {
          trail: "Dashboard > Users > Dara",
          current: "Dara",
          links: [dashboardLink, usersLink],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/users/456/edit",
        expected: {
          trail: "Dashboard > Users > Dara > Edit",
          current: "Edit",
          links: [
            dashboardLink,
            usersLink,
            { label: "Dara", href: "/dashboard/users/456" },
          ],
        },
        source: "explicit",
      },
      {
        path: "/dashboard/settings",
        expected: {
          trail: "Dashboard > Settings",
          current: "Settings",
          links: [dashboardLink],
        },
        source: "catch-all",
      },
      {
        path: "/dashboard/water-vending",
        expected: {
          trail: "Dashboard > Water Vending",
          current: "Water Vending",
          links: [dashboardLink],
        },
        source: "catch-all",
      },
      {
        path: "/dashboard/water-vending/create",
        expected: {
          trail: "Dashboard > Water Vending > Create",
          current: "Create",
          links: [dashboardLink, waterVendingLink],
        },
        source: "catch-all",
      },
      {
        path: "/dashboard/water-vending/004915",
        expected: {
          trail: "Dashboard > Water Vending > 004915",
          current: "004915",
          links: [dashboardLink, waterVendingLink],
        },
        source: "catch-all",
      },
      {
        path: "/dashboard/water-vending/004915/edit",
        expected: {
          trail: "Dashboard > Water Vending > 004915 > Edit",
          current: "Edit",
          links: [
            dashboardLink,
            waterVendingLink,
            {
              label: "004915",
              href: "/dashboard/water-vending/004915",
            },
          ],
        },
        source: "catch-all",
      },
    ];

    for (const route of routes) {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expectBreadcrumb(page, route.expected);
      await expectBreadcrumbSource(page, route.source);
      await expect(page.locator('[data-app-navbar="true"]')).toHaveCount(1);
      await expect(page.locator('[data-app-sidebar="true"]')).toHaveCount(1);
    }
  });

  test("preserves a dynamic breadcrumb across a hard refresh", async ({
    page,
  }) => {
    const expected = {
      trail: "Dashboard > Users > Sokha > Edit",
      current: "Edit",
      links: [
        dashboardLink,
        usersLink,
        { label: "Sokha", href: "/dashboard/users/123" },
      ],
    } as const;

    await page.goto("/dashboard/users/123/edit");
    await expectBreadcrumb(page, expected);

    const response = await page.reload();
    expect(response?.status()).toBe(200);
    await expectBreadcrumb(page, expected);
  });

  test("handles the complete soft-navigation and history sequence", async ({
    page,
  }) => {
    let documentRequests = 0;
    page.on("request", (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        documentRequests += 1;
      }
    });

    await page.goto("/dashboard/users");
    await expectBreadcrumb(page, {
      trail: "Dashboard > Users",
      current: "Users",
      links: [dashboardLink],
    });

    await expectSlowNavigation(
      page,
      () => page.getByRole("link", { name: "View Sokha" }).click(),
      {
        trail: "Dashboard > Users > Sokha",
        current: "Sokha",
        links: [dashboardLink, usersLink],
      },
    );

    await expectSlowNavigation(
      page,
      () => page.getByRole("link", { name: "Edit this user" }).click(),
      {
        trail: "Dashboard > Users > Sokha > Edit",
        current: "Edit",
        links: [
          dashboardLink,
          usersLink,
          { label: "Sokha", href: "/dashboard/users/123" },
        ],
      },
    );

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/users\/123$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Users > Sokha",
      current: "Sokha",
      links: [dashboardLink, usersLink],
    });

    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Users", exact: true })
      .click();
    await expect(page).toHaveURL(/\/dashboard\/users$/);

    await expectSlowNavigation(
      page,
      () => page.getByRole("link", { name: "View Dara" }).click(),
      {
        trail: "Dashboard > Users > Dara",
        current: "Dara",
        links: [dashboardLink, usersLink],
      },
    );

    await page
      .getByRole("navigation", { name: "Dashboard navigation" })
      .getByRole("link", { name: "Settings", exact: true })
      .click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Settings",
      current: "Settings",
      links: [dashboardLink],
    });
    expect(documentRequests).toBe(1);

    const refreshed = await page.reload();
    expect(refreshed?.status()).toBe(200);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Settings",
      current: "Settings",
      links: [dashboardLink],
    });

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/users\/456$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Users > Dara",
      current: "Dara",
      links: [dashboardLink, usersLink],
    });

    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Settings",
      current: "Settings",
      links: [dashboardLink],
    });
    expect(documentRequests).toBe(2);
  });

  test("supports nested Water Vending navigation and history", async ({
    page,
  }) => {
    let documentRequests = 0;
    page.on("request", (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        documentRequests += 1;
      }
    });

    await page.goto("/dashboard/water-vending");
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending",
      current: "Water Vending",
      links: [dashboardLink],
    });

    await page.getByRole("link", { name: "Create vending unit" }).click();
    await expect(page).toHaveURL(/\/dashboard\/water-vending\/create$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending > Create",
      current: "Create",
      links: [dashboardLink, waterVendingLink],
    });

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/water-vending$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending",
      current: "Water Vending",
      links: [dashboardLink],
    });

    await expectSlowNavigation(
      page,
      () =>
        page
          .getByRole("link", { name: "View vending unit 004915" })
          .click(),
      {
        trail: "Dashboard > Water Vending > 004915",
        current: "004915",
        links: [dashboardLink, waterVendingLink],
      },
      '[data-vending-loading="true"]',
      true,
    );
    await expectBreadcrumbSource(page, "catch-all");

    await expectSlowNavigation(
      page,
      () => page.getByRole("link", { name: "Edit vending unit" }).click(),
      {
        trail: "Dashboard > Water Vending > 004915 > Edit",
        current: "Edit",
        links: [
          dashboardLink,
          waterVendingLink,
          {
            label: "004915",
            href: "/dashboard/water-vending/004915",
          },
        ],
      },
      '[data-vending-loading="true"]',
      true,
    );
    await expectBreadcrumbSource(page, "catch-all");

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/water-vending\/004915$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending > 004915",
      current: "004915",
      links: [dashboardLink, waterVendingLink],
    });

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/water-vending$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending",
      current: "Water Vending",
      links: [dashboardLink],
    });

    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard\/water-vending\/004915$/);
    await expectBreadcrumb(page, {
      trail: "Dashboard > Water Vending > 004915",
      current: "004915",
      links: [dashboardLink, waterVendingLink],
    });

    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard\/water-vending\/004915\/edit$/);
    const editBreadcrumb = {
      trail: "Dashboard > Water Vending > 004915 > Edit",
      current: "Edit",
      links: [
        dashboardLink,
        waterVendingLink,
        { label: "004915", href: "/dashboard/water-vending/004915" },
      ],
    } as const;
    await expectBreadcrumb(page, editBreadcrumb);
    expect(documentRequests).toBe(1);

    const refreshed = await page.reload();
    expect(refreshed?.status()).toBe(200);
    await expectBreadcrumb(page, editBreadcrumb);
    expect(documentRequests).toBe(2);
  });

  test("renders defined streamed not-found states for unknown users", async ({
    page,
  }) => {
    for (const path of [
      "/dashboard/users/999",
      "/dashboard/users/999/edit",
    ]) {
      const response = await page.goto(path);

      // The loading boundary starts a streamed 200 response before notFound().
      expect(response?.status()).toBe(200);
      await expect(page.locator('[data-user-not-found="true"]')).toBeVisible();
      await expectBreadcrumb(page, {
        trail: "Dashboard > Users > User not found",
        current: "User not found",
        links: [dashboardLink, usersLink],
      });
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
        "content",
        "noindex",
      );
      await expect(page.getByRole("link", { name: "Return to users" })).toHaveAttribute(
        "href",
        "/dashboard/users",
      );
    }
  });

  test("renders defined streamed not-found states for unknown vending units", async ({
    page,
  }) => {
    for (const path of [
      "/dashboard/water-vending/999999",
      "/dashboard/water-vending/999999/edit",
    ]) {
      const response = await page.goto(path);

      // The loading boundary starts a streamed 200 response before notFound().
      expect(response?.status()).toBe(200);
      await expect(
        page.locator('[data-vending-not-found="true"]'),
      ).toBeVisible();
      await expectBreadcrumb(page, {
        trail: "Dashboard > Water Vending > Vending unit not found",
        current: "Vending unit not found",
        links: [dashboardLink, waterVendingLink],
      });
      await expectBreadcrumbSource(page, "catch-all");
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
        "content",
        "noindex",
      );
      await expect(
        page.getByRole("link", { name: "Return to Water Vending" }),
      ).toHaveAttribute("href", "/dashboard/water-vending");
    }
  });

  test("gives explicit routes precedence and exposes the catch-all fallback", async ({
    page,
  }) => {
    await page.goto("/dashboard/users");
    await expectBreadcrumb(page, {
      trail: "Dashboard > Users",
      current: "Users",
      links: [dashboardLink],
    });
    await expectBreadcrumbSource(page, "explicit");

    const response = await page.goto("/dashboard/catch-all-probe");
    // A notFound() from the slot marks the whole valid page response as 404.
    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-catch-all-probe="true"]')).toBeVisible();
    await expectBreadcrumb(page, {
      trail: "Dashboard > Breadcrumb unavailable",
      current: "Breadcrumb unavailable",
      links: [dashboardLink],
    });
    await expect(
      page.locator('[data-breadcrumb-source="catch-all-not-found"]'),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      "noindex",
    );

    const refreshed = await page.reload();
    expect(refreshed?.status()).toBe(404);
    await expect(page.locator('[data-catch-all-probe="true"]')).toBeVisible();
    await expect(
      page.locator('[data-breadcrumb-source="catch-all-not-found"]'),
    ).toBeVisible();
  });
});
