import Goal from "../models/goalModel";
import { Request, Response } from "express";
import { GoalType, SubjectType } from "../types/goal";

export const newGoal = async (req: Request, res: Response) => {
  try {
    const { title, description, subjects, dueDate } = req.body;
    if (!(title && subjects && dueDate)) {
      res.status(400).json({
        success: false,
        message: `please fill all the details`,
      });
      return;
    }
    const goal = await Goal.create({
      title,
      description,
      subjects,
      dueDate,
    });
    return res.status(200).json({
      success: true,
      message: "The goal is set",
      goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while creating goal and error is ${error}`,
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { goalId, type, subjectIndex, topicIndex } = req.params;
  const newStatus = req.body.newStatus;

  try {
    const goal: GoalType | any = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update status based on type
    if (type === "subject") {
      goal.subjects[subjectIndex].status = newStatus;
    } else if (type === "topic") {
      goal.subjects[subjectIndex].topics[topicIndex].status = newStatus;
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    // Save the updated goal
    await goal.save();

    return res.json({ message: "Status updated successfully", goal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
