import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Restaurant ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters'],
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snacks'],
        message: 'Category must be one of: Starter, Main Course, Dessert, Beverage, Snacks',
      },
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      enum: {
        values: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'French', 'Mediterranean', 'American', 'Korean', 'Middle Eastern', 'Continental'],
        message: 'Cuisine must be one of: Indian, Chinese, Italian, Mexican, Thai, Japanese, French, Mediterranean, American, Korean, Middle Eastern, Continental',
      },
    },
    subCategory: {
      type: String,
      required: false,
      enum: {
        values: ['Pizza', 'Burger', 'Pasta', 'Noodles', 'Rice', 'Sandwich', 'Salad', 'Soup', 'Curry', 'Biryani', 'Kebab', 'Meal', 'Cake', 'Dessert', 'Juice', 'Coffee', 'Tea'],
        message: 'Sub-category must be a valid food type',
      },
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    restaurantLocation: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
