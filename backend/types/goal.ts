import { Document } from "mongoose";

export interface GoalType extends Document {
  title: string;
  description: string;
  subjects: SubjectType[];
  dueDate: Date;
}

export interface SubjectType extends Document {
  title: string;
  status: string;
  topics: TopicType[];
}

export interface TopicType extends Document {
  title: string;
  status: string;
}
