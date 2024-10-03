import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productsSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Block'],
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { collection: 'Category', timestamps: true }
);

productsSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('title')) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
    }
    next();
});


const filterDeleted = function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
};

productsSchema.pre('find', filterDeleted);
productsSchema.pre('findOne', filterDeleted);
productsSchema.pre('findOneAndUpdate', filterDeleted);
productsSchema.pre('findByIdAndUpdate', filterDeleted);

const Product = model('Products', productsSchema);

export default Product;
