import User from "../models/user.model.js";
import generateAccessToken from "../libs/utils/generateAccessToken.js";

export const signup = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      middleName, 
      email, 
      password, 
      confirmPassword,
      contactNumber,
      course,
      street,
      city,
      province,
      postalCode,
      country,
      dateOfBirth,
      gender,
    } = req.body;

    if(!firstName || !middleName || !lastName || !email || !password || !confirmPassword || !contactNumber || !course || !street || !city || !province || !postalCode || !country || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email }).lean();
    if(existingUser) {
      return res.status(400).json({ success: false,error: "User already exist" });
    }

    const contactNumberRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)*\d{3,4}[-.\s]?\d{3,4}$/;
    if(!contactNumberRegex.test(contactNumber) || contactNumber.length < 11) {
      return res.status(400).json({ success: false, error: "Invalid contact number format" });
    }

    if(password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters length"});
    }

    if(password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const newUser = new User({
      firstName, 
      lastName, 
      middleName, 
      email, 
      password,
      confirmPassword,
      contactNumber,
      course,
      address: {
        street,
        city,
        province,
        postalCode,
        country,
      },
      dateOfBirth,
      gender,
    });

    generateAccessToken(newUser._id, res);
    await newUser.save();

    res.status(200).json({ 
      success: true, 
      user: {
        ...newUser._doc,
        password: undefined,
      }
    });
  } catch (error) {
    console.error(`Error in signup controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required"});
    }

    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    generateAccessToken(user._id, res);

    res.status(200).json({ 
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      }  
    });
  } catch (error) {
    console.error(`Error in login controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("student-record-user");
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.error(`Error in logout controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(`Error in getMe controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
}