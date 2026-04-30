import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatCurrency, formatStatus, toNumber } from "../src/features/customer-app/format";

describe("customer app formatting helpers", () => {
  it("normalizes decimal-like values to numbers", () => {
    assert.equal(toNumber("1200.50"), 1200.5);
    assert.equal(toNumber({ toString: () => "42" }), 42);
    assert.equal(toNumber(null), 0);
  });

  it("formats status enum values for display", () => {
    assert.equal(formatStatus("FABRIC_INSPECTION_PENDING"), "Fabric Inspection Pending");
  });

  it("formats INR amounts without fractional digits", () => {
    assert.equal(formatCurrency(1500, "INR"), "₹1,500");
  });
});
