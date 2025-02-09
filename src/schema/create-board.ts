import z from "zod";

export const CreateBoardSchema = z.object({
  title: z.string({
    required_error: "Please add title",
  }),
});

export type CreateBoardType = z.infer<typeof CreateBoardSchema>;
