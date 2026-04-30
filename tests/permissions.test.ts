import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APP_PERMISSIONS, hasPermission } from "../src/lib/rbac/permissions";

describe("role permission mapping", () => {
  it("allows super admins to access every application permission", () => {
    for (const permission of Object.values(APP_PERMISSIONS)) {
      assert.equal(hasPermission("SUPER_ADMIN", permission), true);
    }
  });

  it("does not grant customer admin permissions", () => {
    assert.equal(hasPermission("CUSTOMER", APP_PERMISSIONS.dashboardView), false);
    assert.equal(hasPermission("CUSTOMER", APP_PERMISSIONS.ordersManage), false);
  });

  it("allows operations managers to manage production work", () => {
    assert.equal(hasPermission("OPERATIONS_MANAGER", APP_PERMISSIONS.ordersAssign), true);
    assert.equal(hasPermission("OPERATIONS_MANAGER", APP_PERMISSIONS.alterationsManage), true);
  });
});
