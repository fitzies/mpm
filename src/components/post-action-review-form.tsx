"use client";

import { postActionReviewSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Commander, Company, ConductType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addSpacesToEnumValue } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import Spinner from "./spinner";
import { handlePostActionReviewForm } from "@/lib/actions";

export type FormSchema = z.infer<typeof postActionReviewSchema>;

export default function PostActionReviewForm({
  name,
  company,
}: {
  name: string;
  company: Company;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(postActionReviewSchema),
    defaultValues: {
      name: name,
      company: company.name,
      conductType: "",
      dateReported: "",
      observation: "",
      recommendation: "",
      reflection: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const conductType: ConductType[] = Object.values(ConductType);

  const handleSubmit = async (values: FormSchema) => {
    const formData = new FormData();
    Object.entries(values).map(([key, value]) => {
      formData.append(key, value);
    });
    handlePostActionReviewForm(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="lg:w-1/3 w-full mx-auto flex flex-col gap-4 px-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Submit a new barrack damage</h1>
          <p className="text-zinc-400 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse,
            beatae?
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="3SG Brian" value={name} />
              </FormControl>
              <FormDescription>Your name will be public.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="3SG Brian" value={company.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conductType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conduct Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of damage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {conductType.map((type) => {
                    return (
                      <SelectItem value={type} key={type}>
                        {addSpacesToEnumValue(type)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {/* <FormDescription>
                This will help categorize damages.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I observed that..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reflection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reflection</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I reflected that..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recommendation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I recommend that..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSubmitting ? (
          <Button disabled className="mt-4">
            <Spinner className="scale-75" />
          </Button>
        ) : (
          <Button className="w-full mt-4">Submit</Button>
        )}
      </form>
    </Form>
  );
}
