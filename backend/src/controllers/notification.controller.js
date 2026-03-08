import {
  createNotification,
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead
} from "../models/notification.model.js";


// GET notifications
export const getNotifications = async (req, res) => {
  try {

    const { userId } = req.params;

    const data = await getNotificationsByUser(userId);

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// CREATE notification
export const createNotificationController = async (req, res) => {
  try {

    const { userId, message } = req.body;

    await createNotification(userId, message);

    res.json({
      message: "Notification created"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// MARK AS READ
export const markAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    await markNotificationRead(id);

    res.json({
      message: "Notification marked as read"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


export const markAllAsRead = async (req, res) => {
  const { userId } = req.params;

  await markAllNotificationsRead(userId);

  res.json({ message: "All notifications marked as read" });
};