import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';

export const notificationService = {
  async getNotifications(roleTarget = null, userId = null) {
    let notifications = db.getCollection('notifications');

    if (roleTarget) {
      notifications = notifications.filter(
        (n) => n.roleTarget === roleTarget || n.roleTarget === 'all' || (userId && n.userId === userId)
      );
    }

    return notifications;
  },

  async markAsRead(id) {
    const updated = await db.updateById('notifications', id, { read: true });
    if (!updated) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async markAllAsRead(roleTarget = null) {
    const dbData = db.readSync();
    if (!dbData.notifications) return [];

    dbData.notifications = dbData.notifications.map((n) => {
      if (!roleTarget || n.roleTarget === roleTarget || n.roleTarget === 'all') {
        return { ...n, read: true };
      }
      return n;
    });

    await db.writeAtomic(dbData);
    return dbData.notifications;
  },

  async createNotification(data) {
    const newNotif = {
      id: generateId('notif'),
      roleTarget: data.roleTarget || 'all',
      userId: data.userId || null,
      title: data.title,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: data.relatedRequestId || null,
      type: data.type || 'info',
    };

    await db.insert('notifications', newNotif);
    return newNotif;
  },

  async deleteNotification(id) {
    const success = await db.deleteById('notifications', id);
    if (!success) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};
