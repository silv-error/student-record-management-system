import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const getStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "Student" }).select("-password").lean();
    res.status(200).json({ success: true, users });
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if(!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ 
      success: true,
      user: {
        ...user,
        password: undefined,
      } 
    })
  } catch (error) {
    console.error(`Error in getUserProfile controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const editProfile = async (req, res) => {
  try {
    let user = req.user;
    const { 
      firstName, 
      lastName, 
      middleName, 
      email, 
      contactNumber, 
      course,
      yearLevel,
      gender, 
      dateOfBirth,
      street,
      city,
      province,
      postalCode,
      country,
      bio,
    } = req.body;
    let { profileImg } = req.body;

    if(profileImg) {
      if(user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().slice(".")[0]);
      }
      profileImg = (await cloudinary.uploader.upload(profileImg)).secure_url;
    }

    if(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
      }

      const existingUser = await User.findOne({ email,  _id: { $ne: user._id }}).lean();
      if(existingUser) {
        return res.status(400).json({ success: false,error: "User already exist" });
      }
    }

    if(contactNumber) {
      const contactNumberRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)*\d{3,4}[-.\s]?\d{3,4}$/;
      if(!contactNumberRegex.test(contactNumber) || contactNumber.length < 11) {
        return res.status(400).json({ success: false, error: "Invalid contact number format" });
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.middleName = middleName || user.middleName;
    user.email = email || user.email;
    user.contactNumber = contactNumber || user.contactNumber;
    user.course = course || user.course;
    user.yearLevel = yearLevel || user.yearLevel;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.address.street = street || user.address.street;
    user.address.city = city || user.address.city;
    user.address.province = province || user.address.province;
    user.address.postalCode = postalCode || user.address.postalCode;
    user.address.country = country || user.address.country;
    user.profileImg = profileImg || user.profileImg;
    user.bio = bio || user.bio;
    
    await user.save();
    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      }
    });
  } catch (error) {
    console.error(`Error in editProfile controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    let user = await User.findById(userId);

    if(!oldPassword || !newPassword || !confirmPassword) {
      return res.status(404).json({ success: false, error: "All fields are required" });
    }

    const validPassword = await user.comparePassword(oldPassword);
    if(!validPassword) {
      return res.status(404).json({ success: false, error: "Old password is incorrect" });
    }
    
    if(newPassword.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters length" });
    }


    if(newPassword !== confirmPassword) {
      return res.status(404).json({ success: false, error: "Password do not match" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ 
      success: false, 
      message: "Password updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      }
    })
  } catch (error) {
    console.error(`Error in changePassword controller: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}