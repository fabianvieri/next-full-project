"use client";

import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SimpleMDE from "react-simplemde-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Callout, Text } from "@radix-ui/themes";
import { createIssueSchema } from "@/lib/validationSchema";

import Spinner from "@/app/components/Spinner";
import ErrorMessage from "@/app/components/ErrorMessage";

import "easymde/dist/easymde.min.css";

type IssueForm = z.infer<typeof createIssueSchema>;

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const createIssue = async (data: IssueForm) => {
    setIsSubmitting(true);
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Unexpected error occured.");
      setIsSubmitting(false);
      return;
    }

    router.push("/issues");
  };

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={handleSubmit(createIssue)}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          Submit New Issue {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}
