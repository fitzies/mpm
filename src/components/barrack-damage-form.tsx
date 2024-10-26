"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { handleBarrackDamageForm } from "@/lib/actions";
import { barrackDamageSchema } from "@/lib/form-schemas";

export type FormSchema = z.infer<typeof barrackDamageSchema>;

export default function BarrackDamageForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(barrackDamageSchema),
    defaultValues: {
      company: "",
      name: "",
      description: "",
      severe: false,
    },
  });

  const barrackDamageType = [
    "Electrical",
    "Structural",
    "Plumbing",
    "Doors",
    "Windows",
    "Furniture",
    "Others",
  ];

  const handleSubmit = async (values: FormSchema) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("company", values.company);
    formData.append("date-reported", JSON.stringify(values.dateReported));
    formData.append("description", values.description);
    formData.append("severe", JSON.stringify(values.severe));
    formData.append("type", values.type);
    await handleBarrackDamageForm(formData);
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
              <FormLabel>Rank & Name</FormLabel>
              <FormControl>
                <Input placeholder="3SG Brian" {...field} />
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
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Alpha">Alpha</SelectItem>
                  <SelectItem value="Bravo">Bravo</SelectItem>
                  <SelectItem value="Charlie">Charlie</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="HQ">HQ</SelectItem>
                </SelectContent>
              </Select>
              {/* <FormDescription>Your company will be public.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of damage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of damage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {barrackDamageType.map((type) => {
                    return (
                      <SelectItem value={type} key={type}>
                        {type}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide information about the damage"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This will provide more insight on the damage.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateReported"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date reported</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                This is required for accounting.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="severe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4 mb-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Severe</FormLabel>
                <FormDescription>
                  This prioritizes this barrack damage over all others.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full">Submit</Button>
      </form>
    </Form>
  );
}
