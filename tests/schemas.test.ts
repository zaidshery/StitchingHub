import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAddressSchema } from "../src/features/customer/schemas";
import { createCouponSchema, createRefundSchema } from "../src/features/finance/schemas";
import { createOrderSchema } from "../src/features/orders/schemas";
import { createReviewSchema } from "../src/features/reviews/schemas";
import { createSupportTicketSchema } from "../src/features/support/schemas";

describe("customer input schemas", () => {
  it("defaults address country and default flag", () => {
    const parsed = createAddressSchema.parse({
      label: "Home",
      recipientName: "Ishita Malhotra",
      phone: "+919810000004",
      line1: "14 Gulmohar Residency",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560102",
    });

    assert.equal(parsed.country, "India");
    assert.equal(parsed.isDefault, false);
  });

  it("accepts a minimal booking order payload", () => {
    const parsed = createOrderSchema.parse({
      addressId: "addr_123",
      items: [{ serviceId: "svc_123" }],
    });

    assert.equal(parsed.fabricSourceType, "CUSTOMER_PROVIDED");
    assert.equal(parsed.paymentMode, "BOOKING_AMOUNT");
    assert.equal(parsed.items[0].quantity, 1);
  });

  it("normalizes support ticket and review payloads", () => {
    const ticket = createSupportTicketSchema.parse({
      subject: "Need delivery help",
      message: "Can you confirm when my order will arrive?",
      category: "delivery",
    });
    const review = createReviewSchema.parse({
      orderNumber: "TCS-1002",
      rating: "5",
      title: "Lovely fit",
    });

    assert.equal(ticket.category, "delivery");
    assert.equal(review.rating, 5);
  });

  it("normalizes finance admin payloads", () => {
    const coupon = createCouponSchema.parse({
      code: "launch10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      startsAt: "2026-05-01T00:00:00.000Z",
      endsAt: "2026-06-01T00:00:00.000Z",
    });
    const refund = createRefundSchema.parse({
      paymentId: "pay_123",
      amount: "500",
      reason: "Customer requested cancellation before production.",
    });

    assert.equal(coupon.code, "LAUNCH10");
    assert.equal(coupon.isActive, true);
    assert.equal(refund.amount, 500);
  });
});
