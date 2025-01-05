"use client";

import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormSchema, AuthForm } from "@/schema/auth";

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
  } = useForm<AuthForm>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: true,
  });
  const { toast } = useToast();

  const submitData = async (data: { email: string; password: string }) => {
    try {
      await fetch("/api/auth", {
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
            {...register("email")}
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
            {...register("password")}
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
