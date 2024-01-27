import { Document } from "mongoose";

export interface UserType extends Document {
	username:string,
	email:string,
	password:string
}