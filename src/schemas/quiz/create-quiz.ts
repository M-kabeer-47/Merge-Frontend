import z from "zod";

// Schema for a single question
const questionSchema = z.object({
  text: z
    .string()
    .min(1, "Question text is required")
    .max(500, "Question must be 500 characters or less")
    .trim(),
  options: z
    .array(z.string().min(1, "Option cannot be empty").trim())
    .min(2, "Question must have at least 2 options")
    .max(10, "Question cannot have more than 10 options"),
  correctOption: z.string().min(1, "Correct answer is required"),
  points: z.preprocess(
    (val) => (val === "" || val === undefined ? 1 : Number(val)),
    z
      .number()
      .min(1, "Points must be at least 1")
      .max(100, "Points cannot exceed 100")
  ),
});

export const createQuizSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  timeLimitMin: z.preprocess(
    (val) => (val === "" || val === undefined ? 30 : Number(val)),
    z
      .number()
      .min(5, "Time limit must be at least 5 minutes")
      .max(180, "Time limit cannot exceed 180 minutes")
  ),
  deadline: z.string().min(1, "Deadline is required"),
  questions: z
    .array(questionSchema)
    .min(1, "Quiz must have at least 1 question")
    .max(50, "Quiz cannot exceed 50 questions"),
});

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;

// Validation helper for question
export const validateQuestion = (question: z.infer<typeof questionSchema>) => {
  // Ensure correct answer is one of the options
  if (!question.options.includes(question.correctOption)) {
    return "Correct answer must be one of the options";
  }
  return null;
};

export const defaultValues = {
  title: "",
  timeLimitMin: 30,
  deadline: "",
  questions: [
    {
      text: "",
      options: ["", "", "", ""],
      correctOption: "",
      points: 1,
    },
  ],
};
