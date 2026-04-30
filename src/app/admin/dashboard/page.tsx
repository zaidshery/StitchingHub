import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { formatCurrency, formatDate, formatStatus } from "@/features/customer-app/format";
import {
  assignOrderAction,
  updateAlterationAction,
  updateConsultationAction,
  updateOrderStatusAction,
  updateSupportTicketAction,
} from "@/features/admin/actions";
import { adminDashboardService } from "@/features/admin/dashboard-service";
import { getServerSessionUser } from "@/lib/auth/server-session";
import { APP_PERMISSIONS, hasPermission } from "@/lib/rbac/permissions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Operational dashboard for tailoring orders, consultations, assignments, and alteration requests.",
};

function personName(person?: { firstName: string; lastName: string } | null) {
  if (!person) {
    return "Unassigned";
  }

  return `${person.firstName} ${person.lastName}`;
}

function dateTimeInputValue(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function SelectField({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-10 rounded-md border bg-white px-3 text-sm normal-case tracking-normal text-foreground"
      >
        {children}
      </select>
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="h-10 rounded-md bg-[#2a211d] px-4 text-sm font-semibold text-white hover:bg-accent"
    >
      {children}
    </button>
  );
}

export default async function AdminDashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.roleName, APP_PERMISSIONS.dashboardView)) {
    redirect("/dashboard");
  }

  const snapshot = await adminDashboardService.getOperationsSnapshot();
  const designers = snapshot.staff.filter((member) => member.role.name === "DESIGNER");
  const tailors = snapshot.staff.filter((member) => member.role.name === "TAILOR");
  const supportStaff = snapshot.staff.filter((member) => member.role.name === "CUSTOMER_SUPPORT");

  return (
    <main className="pb-16 pt-8">
      <Container className="max-w-7xl space-y-8">
        <section className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Operations</p>
            <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">Admin dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Signed in as {personName(user)}. Manage the active production queue, consultation requests, and
              alteration follow-ups from one workspace.
            </p>
          </div>
          <Link href="/" className="rounded-md border bg-white px-4 py-2 text-sm font-semibold">
            Storefront
          </Link>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border bg-white/85 p-4">
            <p className="text-sm text-muted">Orders</p>
            <p className="mt-2 font-display text-4xl">{snapshot.metrics.orders.total}</p>
          </div>
          <div className="border bg-white/85 p-4">
            <p className="text-sm text-muted">Consultations</p>
            <p className="mt-2 font-display text-4xl">{snapshot.metrics.consultations.total}</p>
          </div>
          <div className="border bg-white/85 p-4">
            <p className="text-sm text-muted">Customers</p>
            <p className="mt-2 font-display text-4xl">{snapshot.metrics.customers.total}</p>
          </div>
          <div className="border bg-white/85 p-4">
            <p className="text-sm text-muted">Collected revenue</p>
            <p className="mt-2 font-display text-4xl">
              {formatCurrency(snapshot.metrics.revenue.collectedAmount)}
            </p>
          </div>
          <div className="border bg-white/85 p-4">
            <p className="text-sm text-muted">Support queue</p>
            <p className="mt-2 font-display text-4xl">{snapshot.supportTickets.length}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl">Active orders</h2>
              <p className="text-sm text-muted">{snapshot.orders.length} newest active orders</p>
            </div>

            <div className="overflow-x-auto border bg-white/85">
              <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#f4e7db] text-xs uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="p-3 font-semibold">Order</th>
                    <th className="p-3 font-semibold">Customer</th>
                    <th className="p-3 font-semibold">Production</th>
                    <th className="p-3 font-semibold">Payment</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.orders.map((order) => (
                    <tr key={order.id} className="border-t align-top">
                      <td className="p-3">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="mt-1 max-w-52 text-xs leading-5 text-muted">
                          {order.items.map((item) => `${item.serviceNameSnapshot} x${item.quantity}`).join(", ")}
                        </p>
                        <p className="mt-2 text-xs text-muted">Created {formatDate(order.createdAt)}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold">{personName(order.customer)}</p>
                        <p className="mt-1 text-xs text-muted">{order.customer.email}</p>
                        <p className="text-xs text-muted">{order.customer.phone ?? "No phone"}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-xs text-muted">Designer</p>
                        <p className="font-semibold">{personName(order.designer)}</p>
                        <p className="mt-2 text-xs text-muted">Tailor</p>
                        <p className="font-semibold">
                          {personName(order.tailorAssignments[0]?.tailor)}
                        </p>
                        <p className="mt-2 text-xs text-muted">
                          Fabric {order.fabricPickup ? formatStatus(order.fabricPickup.status) : "Not scheduled"}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold">{formatCurrency(order.totalAmount, order.currencyCode)}</p>
                        <p className="mt-1 text-xs text-muted">
                          Paid {formatCurrency(order.amountPaid, order.currencyCode)}
                        </p>
                        <p className="mt-1 text-xs text-muted">{formatStatus(order.paymentStatus)}</p>
                      </td>
                      <td className="p-3">
                        <form action={updateOrderStatusAction} className="grid min-w-56 gap-2">
                          <input type="hidden" name="orderId" value={order.id} />
                          <SelectField name="status" label="Move to" defaultValue={order.status}>
                            {snapshot.orderStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatus(status)}
                              </option>
                            ))}
                          </SelectField>
                          <input
                            name="comment"
                            placeholder="Status note"
                            className="h-10 rounded-md border bg-white px-3 text-sm"
                          />
                          <SubmitButton>Update</SubmitButton>
                        </form>
                      </td>
                      <td className="p-3">
                        <form action={assignOrderAction} className="grid min-w-56 gap-2">
                          <input type="hidden" name="orderId" value={order.id} />
                          <SelectField name="designerId" label="Designer" defaultValue={order.designer ? "" : undefined}>
                            <option value="">No change</option>
                            {designers.map((designer) => (
                              <option key={designer.id} value={designer.id}>
                                {personName(designer)}
                              </option>
                            ))}
                          </SelectField>
                          <SelectField name="tailorId" label="Tailor">
                            <option value="">No change</option>
                            {tailors.map((tailor) => (
                              <option key={tailor.id} value={tailor.id}>
                                {personName(tailor)}
                              </option>
                            ))}
                          </SelectField>
                          <SubmitButton>Assign</SubmitButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {snapshot.orders.length === 0 ? (
                    <tr>
                      <td className="p-6 text-sm text-muted" colSpan={6}>
                        No active orders are waiting in the queue.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl">Consultations</h2>
                <p className="text-sm text-muted">{snapshot.consultations.length} open</p>
              </div>
              {snapshot.consultations.map((consultation) => (
                <form key={consultation.id} action={updateConsultationAction} className="space-y-3 border bg-white/85 p-4">
                  <input type="hidden" name="consultationId" value={consultation.id} />
                  <div>
                    <p className="font-semibold">{personName(consultation.customer)}</p>
                    <p className="text-xs text-muted">
                      {consultation.service?.name ?? "General consultation"} · {formatStatus(consultation.channel)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Requested {formatDate(consultation.requestedDate)} · {consultation.preferredTimeSlot ?? "Any time"}
                    </p>
                  </div>
                  <SelectField name="status" label="Status" defaultValue={consultation.status}>
                    {snapshot.consultationStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField name="designerId" label="Designer" defaultValue={consultation.assignedDesigner ? "" : undefined}>
                    <option value="">No change</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {personName(designer)}
                      </option>
                    ))}
                  </SelectField>
                  <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Scheduled at
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      defaultValue={dateTimeInputValue(consultation.scheduledAt)}
                      className="h-10 rounded-md border bg-white px-3 text-sm normal-case tracking-normal text-foreground"
                    />
                  </label>
                  <textarea
                    name="internalNotes"
                    placeholder="Internal notes"
                    defaultValue={consultation.internalNotes ?? ""}
                    className="min-h-20 w-full rounded-md border bg-white px-3 py-2 text-sm"
                  />
                  <SubmitButton>Save consultation</SubmitButton>
                </form>
              ))}
              {snapshot.consultations.length === 0 ? (
                <div className="border bg-white/85 p-4 text-sm text-muted">No open consultation requests.</div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl">Alterations</h2>
                <p className="text-sm text-muted">{snapshot.alterations.length} open</p>
              </div>
              {snapshot.alterations.map((alteration) => (
                <form key={alteration.id} action={updateAlterationAction} className="space-y-3 border bg-white/85 p-4">
                  <input type="hidden" name="alterationId" value={alteration.id} />
                  <div>
                    <p className="font-semibold">
                      {alteration.order.orderNumber} · {personName(alteration.order.customer)}
                    </p>
                    <p className="mt-1 text-xs text-muted">{alteration.reason}</p>
                    {alteration.details ? (
                      <p className="mt-2 text-sm leading-6 text-muted">{alteration.details}</p>
                    ) : null}
                  </div>
                  <SelectField name="status" label="Status" defaultValue={alteration.status}>
                    {snapshot.alterationStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </SelectField>
                  <SubmitButton>Update alteration</SubmitButton>
                </form>
              ))}
              {snapshot.alterations.length === 0 ? (
                <div className="border bg-white/85 p-4 text-sm text-muted">No open alteration requests.</div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl">Support</h2>
                <p className="text-sm text-muted">{snapshot.supportTickets.length} open</p>
              </div>
              {snapshot.supportTickets.map((ticket) => (
                <form key={ticket.id} action={updateSupportTicketAction} className="space-y-3 border bg-white/85 p-4">
                  <input type="hidden" name="ticketId" value={ticket.id} />
                  <div>
                    <p className="font-semibold">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-muted">
                      {personName(ticket.customer)} · {ticket.order?.orderNumber ?? "General"} · {ticket.category ?? "Support"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{ticket.message}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SelectField name="status" label="Status" defaultValue={ticket.status}>
                      {snapshot.supportTicketStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField name="priority" label="Priority" defaultValue={ticket.priority}>
                      {snapshot.supportTicketPriorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {formatStatus(priority)}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <SelectField name="assignedToUserId" label="Assignee" defaultValue={ticket.assignee ? "" : undefined}>
                    <option value="">No change</option>
                    {supportStaff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {personName(member)}
                      </option>
                    ))}
                  </SelectField>
                  <SubmitButton>Update support</SubmitButton>
                </form>
              ))}
              {snapshot.supportTickets.length === 0 ? (
                <div className="border bg-white/85 p-4 text-sm text-muted">No open support tickets.</div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl">Audit log</h2>
                <p className="text-sm text-muted">{snapshot.auditLogs.length} recent</p>
              </div>
              <div className="space-y-2 border bg-white/85 p-4">
                {snapshot.auditLogs.map((entry) => (
                  <div key={entry.id} className="border-b py-3 last:border-b-0">
                    <p className="text-sm font-semibold">{entry.action}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {entry.entityType} · {entry.entityId} · {personName(entry.actor)} · {formatDate(entry.createdAt)}
                    </p>
                  </div>
                ))}
                {snapshot.auditLogs.length === 0 ? (
                  <p className="text-sm text-muted">No audit entries recorded yet.</p>
                ) : null}
              </div>
            </section>
          </div>
        </section>
      </Container>
    </main>
  );
}
