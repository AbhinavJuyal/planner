"use client";

import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";

interface FormValues {
  email: string;
  password: string;
}

const passwordValidations = {
  required: "Please enter your password",
  minLength: {
    value: 8,
    message: "Password needs to have atleast 8 characters.",
  },
};

const emailValidations = {
  required: "Please add your email",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email",
  },
};

interface ErrorMsgProps {
  msgObj: FieldError;
}

const ErrorMsg = ({ msgObj }: ErrorMsgProps) => {
  const { message } = msgObj;
  return <p className="text-xs text-red-600">{message}</p>;
};

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { toast } = useToast();

  const submitData = async (data: { email: string; password: string }) => {
    try {
      await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log((error as Error).message);
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
            {...register("email", emailValidations)}
            className={clsx(errors.email && "border-red-600")}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
          {errors.email && <ErrorMsg msgObj={errors.email as FieldError} />}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password", passwordValidations)}
            className={clsx(errors.password && "border-red-600")}
            name="password"
            id="password"
            type="password"
          />
          {errors.password && (
            <ErrorMsg msgObj={errors.password as FieldError} />
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
