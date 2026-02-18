import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: false, // Made optional since frontend doesn't collect it initially
      default: '0000000000',
      validate: {
        validator: function (v) {
          // Allow default value or valid 10-digit number
          return !v || v === '0000000000' || /^[0-9]{10}$/.test(v);
        },
        message: 'Please provide a valid 10-digit mobile number',
      },
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'rider', 'restaurant', 'admin'],
        message: 'Role must be either customer, rider, restaurant, or admin',
      },
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    cart:[
        {
        menuItem:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"MenuItem",
          required:true,
        },
        quantity:{
          type:Number,
          required:true,
          min:[1,'Quantity must be at least 1'],
          default:1,
        },
        restaurantId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'User',
          required:true,
        },
      },
    ],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values and only enforces uniqueness for non-null values
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    // Restaurant-specific fields
    restaurantDetails: {
      kitchenName: String,
      cuisine: [String],
      description: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        latitude: Number,
        longitude: Number,
      },
      businessLicense: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      isKitchenOpen: {
        type: Boolean,
        default: true,
      },
      // Restaurant ratings
      rating: {
        average: {
          type: Number,
          default: 0,
          min: 0,
          max: 5
        },
        count: {
          type: Number,
          default: 0
        }
      }
    },
    // Rider-specific fields
    riderDetails: {
      vehicleType: String,
      vehicleNumber: String,
      drivingLicense: String,
      licenseNumber: String,
      aadharNumber: String,
      bankAccount: String,
      ifscCode: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      isAvailable: {
        type: Boolean,
        default: false,
      },
      currentLocation: {
        latitude: Number,
        longitude: Number,
        lastUpdated: Date,
      },
      // Rider statistics
      totalDeliveries: {
        type: Number,
        default: 0
      },
      totalEarnings: {
        type: Number,
        default: 0
      },
      todayEarnings: {
        type: Number,
        default: 0
      },
      lastEarningsReset: {
        type: Date,
        default: Date.now
      },
      // Rider ratings
      rating: {
        average: {
          type: Number,
          default: 2.5,
          min: 0,
          max: 5
        },
        count: {
          type: Number,
          default: 0
        }
      }
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    // Timestamps for password reset
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Don't hash if using Google OAuth (no password)
  if (this.authProvider === 'google' && !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
