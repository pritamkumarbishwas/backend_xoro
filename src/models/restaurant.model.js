import mongoose from 'mongoose';

// Define a sub-schema for opening hours
const openingHoursSchema = new mongoose.Schema({
    open: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)\s?(AM|PM)?$/.test(v),
            message: props => `${props.value} is not a valid opening time!`
        }
    },
    close: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)\s?(AM|PM)?$/.test(v),
            message: props => `${props.value} is not a valid closing time!`
        }
    }
});

// Define the sub-schema for reviews
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500 // Limit comment length
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Define the main restaurant schema
const restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true
        }
    },
    categoryId: [  // Change to camelCase
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    tagId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            required: false
        }
    ],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    openingHours: {
        monday: openingHoursSchema,
        tuesday: openingHoursSchema,
        wednesday: openingHoursSchema,
        thursday: openingHoursSchema,
        friday: openingHoursSchema,
        saturday: openingHoursSchema,
        sunday: openingHoursSchema
    },
    reviews: [reviewSchema], // Use the defined review schema
    averageRating: {  // Add field to store the average rating
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isOpen: {
        type: Boolean,
        default: true
    },
},
    {
        collection: 'Restaurant',
        timestamps: true
    });

// Middleware to filter out soft-deleted restaurants
const filterDeleted = function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
};

// Apply the filter to relevant queries
restaurantSchema.pre('find', filterDeleted);
restaurantSchema.pre('findOne', filterDeleted);
restaurantSchema.pre('findOneAndUpdate', filterDeleted);
restaurantSchema.pre('findByIdAndUpdate', filterDeleted);


// Middleware to update average rating before saving the restaurant
restaurantSchema.methods.updateAverageRating = function () {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = totalRating / this.reviews.length;
    } else {
        this.averageRating = 0;
    }
};

// Create and export the Restaurant model
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
