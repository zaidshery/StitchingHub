import { ConsultationStatus, type Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { notificationService } from "@/lib/notifications/service";

const consultationSelect = {
  id: true,
  serviceId: true,
  assignedDesignerId: true,
  requestedDate: true,
  preferredTimeSlot: true,
  scheduledAt: true,
  status: true,
  channel: true,
  customerNotes: true,
  internalNotes: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ConsultationSelect;

export const consultationService = {
  async list(userId: string) {
    return prisma.consultation.findMany({
      where: { userId },
      select: consultationSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async create(
    userId: string,
    input: {
      serviceId?: string;
      preferredDate: string;
      preferredTimeSlot: string;
      notes?: string;
      channel: "PHONE" | "VIDEO" | "IN_STUDIO" | "WHATSAPP";
    },
  ) {
    if (input.serviceId) {
      const serviceExists = await prisma.service.findUnique({
        where: { id: input.serviceId },
        select: { id: true },
      });

      if (!serviceExists) {
        throw new ApiError(404, "SERVICE_NOT_FOUND", "Selected service was not found");
      }
    }

    const consultation = await prisma.consultation.create({
      data: {
        userId,
        serviceId: input.serviceId,
        requestedDate: new Date(input.preferredDate),
        preferredTimeSlot: input.preferredTimeSlot,
        customerNotes: input.notes,
        status: ConsultationStatus.REQUESTED,
        channel: input.channel,
      },
      select: consultationSelect,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true },
    });

    if (user) {
      await notificationService.dispatch({
        userId: user.id,
        email: user.email,
        phone: user.phone,
        eventKey: "consultation.booked",
        subject: "Consultation booked",
        message: `Your consultation request has been received for ${input.preferredTimeSlot}.`,
      });
    }

    return consultation;
  },
};
