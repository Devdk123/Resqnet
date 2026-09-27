import { appState } from '../../state/store.js';
import type { NotificationRecord } from '../../types/index.js';

export function sendAlert(responderId: string, incidentId: string, wave: number) {
  const record: NotificationRecord = {
    id: `not-${Date.now()}`,
    responderId,
    incidentId,
    wave,
    status: 'sent',
    createdAt: new Date().toISOString()
  };

  appState.notifications.push(record);
  return record;
}

export function updateNotificationStatus(notificationId: string, status: NotificationRecord['status']) {
  const item = appState.notifications.find((notification) => notification.id === notificationId);
  if (!item) return null;
  item.status = status;
  return item;
}
