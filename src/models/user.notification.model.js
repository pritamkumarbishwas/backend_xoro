import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userNotificationsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'UserNotifications',
    timestamps: true, 
  }
);

// Middleware to filter out deleted notifications
userNotificationsSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'findById'], function (next) {
  this.where({ isDeleted: { $ne: true } }); // Filter out deleted notifications
  next();
});

export const UserNotifications = model('UserNotifications', userNotificationsSchema);
