"use server";

import { redirect } from "next/navigation";
import { SessionData } from "../../types";
import { handleLogin } from "./actions";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export async function signIn(formData: FormData): Promise<string | true> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    throw new Error("No username or password given.");
  }

  // Validate form inputs
  if (!username || !password) {
    throw new Error("Missing credentials");
  }

  const user = await prisma.commander.findFirst({
    where: { username },
  });

  if (!user) {
    throw new Error("This user does not exist.");
  }

  // Ensure user.password is not null
  if (!user.password) {
    throw new Error("Your username or password is incorrect.");
  }

  // Compare the passwords using bcrypt
  const isPasswordValid =
    (await bcrypt.compare(password, user.password)) ||
    password === user.password; // do this for now

  if (!isPasswordValid) {
    throw new Error("Your password is incorrect.");
  }

  // Successfully authenticated
  const userData: SessionData = {
    userId: user.id,
    username: user.username!,
  };

  handleLogin(userData);
  redirect("/");
}
