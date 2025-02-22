"use client";

import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormSchema, AuthFormType } from "@/schema/auth";
import { ApiErrorCodes } from "@/utils/constants";
import { useRouter } from "next/navigation";
import FormErrorMsg from "@/components/form-error-msg";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormType>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: true,
  });
  const { toast } = useToast();
  const router = useRouter();

  const submitData = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.statusCode === 201) {
        router.push("/app/my-plans");
        return;
      }

      // error handling in frontend
      if (responseData.statusCode === 500) throw new Error("Signup Failed");

      if (responseData.errors) {
        const [err] = responseData.errors;

        if (err.code === ApiErrorCodes.ERR_USER_PRESENT) {
          toast({
            title: "This email is already registered",
            description: "Please go to login page",
            action: (
              <ToastAction asChild altText="Try again">
                <Link href="/login">Go To Login</Link>
              </ToastAction>
            ),
          });
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitData)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            className={clsx(errors.email && "border-red-600")}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
          {errors.email && <FormErrorMsg msgObj={errors.email as FieldError} />}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            className={clsx(errors.password && "border-red-600")}
            name="password"
            id="password"
            type="password"
          />
          {errors.password && (
            <FormErrorMsg msgObj={errors.password as FieldError} />
          )}
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?&nbsp;&nbsp;
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
