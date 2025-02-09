import * as z from "zod";

export const AuthFormSchema = z.object({
  email: z
    .string({
      required_error: "Please add your email",
    })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string({
      required_error: "Please enter your password",
    })
    .min(8, "Password needs to have atleast 8 characters"),
});

export type AuthFormType = z.infer<typeof AuthFormSchema>;
