import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from '../models/userModel.js';
import defaultPfpUrl from "../config/image-config.js";


// @desc  Auth user/set token
// route POST /api/users/auth
// @access Public( You don't have to be logged in to access the login page )

const authUser = asyncHandler(async (req, res) => {
    const {  email, password  } = (req.body);

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id );
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
      } else {
        res.status(401);
        throw new Error('Invalid Email or Password');
      }

    res.status(200).json({message: 'Auth User'});
});


// @desc  Register new user
// route POST /api/users
// @access Public 


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture  } = (req.body);

  const userExists = await User.findOne({email});
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let profilePictureUrl = defaultPfpUrl;
    if (profilePicture) {
        const uploadResult = await cloudinary.uploader.upload(profilePicture, {
            folder: 'profile-pictures'
        });
        profilePictureUrl = uploadResult.secure_url;
    }

  const user = await User.create({
    name, 
    email, 
    password,
    profilePicture: profilePictureUrl
  });

  if (user) {
    generateToken(res, user._id );
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
    });
  } else {
    res.status(400);
    throw new Error('Invalid User data');
  }
});


// @desc Log Out
// route POST /api/users/logout
// @access Public 

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { 
        expires: new Date(0), 
        httpOnly: true 
    });
    
    res.status(200).json({message: 'Logged out'});
});


// @desc get user profile
// route GET /api/users/profile
// @access private 

const getUserProfile = asyncHandler(async (req, res) => {

  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profilePicture: profilePictureUrl
  }

    res.status(200).json({user});
});

// @desc get user profile
// route PUT /api/users/profile
// @access private 

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.profilePicture) {
      const uploadResult = await cloudinary.uploader.upload(req.body.profilePicture, {
          folder: 'profile-pictures'
      });
      user.profilePicture = uploadResult.secure_url;
  }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture
    });

  } else {
    res.status(404);
    throw new Error('User not found');
  }
    res.status(200).json({message: 'Edit User profile'});
});


export { 
    authUser, 
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
 };
