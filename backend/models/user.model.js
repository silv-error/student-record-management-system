import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  course: {
    type: String,
    default: "",
  },
  yearLevel: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["Student", "Instructor"],
    default: "Student",
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    }
  },
  dateOfBirth: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    enum: ["", "Male", "Female", "Others"],
    default: "",
  },
  profileImg: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;