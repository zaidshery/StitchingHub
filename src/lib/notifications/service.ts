import { NotificationChannel, NotificationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import type { NotificationDispatchInput } from "@/lib/notifications/types";

export const notificationService = {
  async dispatch(input: NotificationDispatchInput) {
    const channels = input.channels ?? [NotificationChannel.EMAIL];

    const operations = channels.flatMap((channel) => {
      const recipient =
        channel === NotificationChannel.EMAIL ? input.email : input.phone;

      if (!recipient) {
        return [];
      }

      logger.info(
        {
          channel,
          eventKey: input.eventKey,
          recipient,
        },
        "Dispatching notification through console adapter",
      );

      return prisma.notification.create({
        data: {
          userId: input.userId,
          channel,
          eventKey: input.eventKey,
          recipient,
          subject: input.subject,
          message: input.message,
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          providerMessageId: `console_${Date.now()}`,
        },
      });
    });

    return Promise.all(operations);
  },
};
