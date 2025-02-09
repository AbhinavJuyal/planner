"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthFormType, AuthFormSchema } from "@/schema/auth";
import { ApiErrorCodes } from "@/utils/constants";
import FormErrorMsg from "@/components/form-error-msg";

const LoginForm = () => {
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        router.push("/app/my-plans");
        return;
      }

      // error handling in frontend
      if (responseData.status === 500) throw new Error("Login Failed");

      if (responseData.errors) {
        const [err] = responseData.errors;

        if (err.code === ApiErrorCodes.ERR_WRONG_PASSWORD) {
          toast({
            variant: "destructive",
            title: "The password provided is incorrect",
            description: "Please enter correct password",
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
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
