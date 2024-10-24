"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

export const CustomDialog = ({
  title,
  description,
  trigger,
  action,
  btn,
  loadingBtn,
  children,
}: {
  title: string;
  description: string;
  trigger?: JSX.Element;
  action: (
    formData: FormData
  ) => Promise<boolean | null | undefined | void | never>;
  btn?: JSX.Element;
  loadingBtn?: JSX.Element;
  children?: JSX.Element[] | JSX.Element;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget); // Get form data

    try {
      const res = await action(formData); // Call the provided action
      if (res === true) {
        setOpen(false); // Close dialog on success
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Set error message
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false); // Reset loading state
    }

    if (error === "") {
      setOpen(() => false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger ?? "Open"}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {children}
          {!loading
            ? btn ?? <Button>Submit</Button>
            : loadingBtn ?? <Button disabled>...</Button>}
        </form>
        <p className="text-sm text-red-400">{error}</p>
      </DialogContent>
    </Dialog>
  );
};
