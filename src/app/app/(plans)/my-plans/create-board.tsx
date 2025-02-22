"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FieldError, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";
import FormErrorMsg from "@/components/form-error-msg";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBoardType, CreateBoardSchema } from "@/schema/create-board";
import { useRouter } from "next/navigation";

const CreateBoard = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBoardType>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      title: "",
    },
    shouldFocusError: true,
  });
  const { toast } = useToast();
  const router = useRouter();

  const submitData = async (data: CreateBoardType) => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-board", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (responseData.statusCode === 201) {
        router.push("/app/my-plans");
        return;
      }

      toast({
        title: "Success",
        description: "New board is created succesfully.",
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-end mb-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <CirclePlus />
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Please specify your new plan for us to use?
            </DialogDescription>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(submitData)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    {...register("title")}
                    className={clsx(errors.title && "border-red-600")}
                    id="title"
                    type="text"
                    placeholder="Your title here"
                  />
                  {errors.title && (
                    <FormErrorMsg msgObj={errors.title as FieldError} />
                  )}
                </div>
                <Button disabled={loading} type="submit" className="ml-auto">
                  {loading && <Loader2 className="animate-spin" />}
                  Create
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBoard;
