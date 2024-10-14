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
      unique: true,
      trim: true, // Optional: removes whitespace from the email
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
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Middleware to filter out deleted notifications
userNotificationsSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'findById'], function (next) {
  this.where({ isDeleted: { $ne: true } }); // Filter out deleted notifications
  next();
});

export const UserNotifications = model('UserNotifications', userNotificationsSchema);
