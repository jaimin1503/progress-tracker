import User from "../models/user";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import "dotenv/config"
import validateEnv from "../src/util/validateEnv";

export const signup = async (req,res)=>{
	try {
		const {username,email,password} = req.body;
		if(!username || !email || !password){
			res.status(400).json({
				success: false,
        		message: `please fill all the details`,
			})
			return;
		}
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "please provide a valid email ",
      });
    }
	if (password.length < 6) {
		return res.status(400).json({
		  success: false,
		  message:
			"your password is to short please provide at least 6 charcter password ",
		});
	  }
	  const userExists = await User.findOne({email})
	  if(userExists){
		return res.status(400).json({
			success: false,
			message: `user already exist please login `,
		  });
	  }
	  let hashedpassword;
    try {
      hashedpassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `error occurred while hashing password and error is ${error}`,
      });
    }
	const user = await User.create({
		username,email,password
	});
	return res.status(200).json({
		success: true,
      	message: "User Created Successfully",
      	data: user,
	})
	} catch (error) {
		if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
			return res.status(400).json({
			  success: false,
			  message: `Email is already in use. Please use a different email.`,
			});
		  } else if (
			error.code === 11000 &&
			error.keyPattern &&
			error.keyPattern.username
		  ) {
			return res.status(400).json({
			  success: false,
			  message: `Username is already taken. Please choose another username.`,
			});
		  } else {
			console.error("Unexpected error occurred:", error);
			return res.status(400).json({
			  success: false,
			  message: `Something went wrong while signing up.`,
			});
		  }
	}
}