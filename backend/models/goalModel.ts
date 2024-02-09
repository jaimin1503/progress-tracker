import mongoose from "mongoose";
import { GoalType } from "../types/goal";
import { model, InferSchemaType, Schema } from "mongoose";

const topicSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Done", "Review", "Pending"],
    default: "Pending",
  },
});

const subjectSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Done", "Review", "Pending"],
    default: "Pending",
  },
  topics: [topicSchema],
});

const goalSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: { type: String },
  subjects: [subjectSchema],
  dueDate: {
    type: Date,
    required: true,
  },
});

type Goal = InferSchemaType<typeof goalSchema>;

export default model<Goal>("Goal", goalSchema);
