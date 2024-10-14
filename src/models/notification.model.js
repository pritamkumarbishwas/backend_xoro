import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['SMS', 'WHATSAPP', 'NOTIFICATION'],
      required: true,
    },
    phone: [{
      type: String,
      required: true,
    }],
    userIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    sentAt: {
      type: Date,
      default: Date.now, // Ensure default is set correctly
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'Notifications',
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Middleware to filter out deleted notifications
const filterDeleted = function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
};

// Apply the filterDeleted middleware to all find operations
notificationSchema.pre('find', filterDeleted);
notificationSchema.pre('findOne', filterDeleted);
notificationSchema.pre('findOneAndUpdate', filterDeleted);
notificationSchema.pre('findById', filterDeleted);

export const Notification = model('Notification', notificationSchema);
