"use client";

import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPolar } from "@/lib/actions";
import { requestAccessToken } from "@/lib/polar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorResponse, setErrorResponse] = useState<string | null>();

  const [fourD, setFourD] = useState<string>("");

  const router = useRouter();

  const searchParams = useSearchParams();
  const authCode = searchParams.get("code");
  console.log(authCode);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await requestAccessToken(authCode!);
      if (token) {
        setAccessToken(token.accessToken);
        setUserId(token.userId);
      } else {
        setError("Failed to fetch access token");
      }
    };

    fetchAccessToken();
  }, []);

  if (!accessToken || !userId) {
    return (
      <Suspense>
        <PageWrapper className="w-screen h-screen flex justify-center items-center">
          <p>Loading...</p>
        </PageWrapper>
      </Suspense>
    );
  }

  if ((error && !accessToken) || !accessToken || !userId) {
    return (
      <Suspense>
        <PageWrapper>
          <p>There was an error trying to register, please try again.</p>
        </PageWrapper>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <PageWrapper className="flex min-h-screen flex-col justify-center items-center">
        {/* <p className="text-white">Auth code: {authCode}</p> */}
        {/* <p>Access token: {accessToken}</p> */}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Register your Polar</CardTitle>
            <CardDescription>
              Enter your 4D below to Register to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form
              action={async (data: FormData) => {
                const res = await submitPolar(data);
                if (res !== true) {
                  setErrorResponse(res);
                }
                if (res === true) {
                  router.push("/polar");
                }
              }}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-2">
                <Label htmlFor="4d">4D</Label>
                <Input
                  id="4d"
                  name="4d"
                  placeholder="V1101"
                  className="col-span-3"
                  value={fourD}
                  maxLength={5}
                  pattern="[A-Za-z][0-9]{4}"
                  title="Please enter one letter followed by four numbers (e.g., V1201)"
                  onChange={(e) => setFourD(e.target.value)}
                  required
                />
              </div>
              <input
                className="hidden"
                name="access-token"
                value={accessToken as string}
              />
              <input
                className="hidden"
                name="user-id"
                value={userId as string}
              />
              <Button
                type="submit"
                className={`w-full ${
                  fourD.length !== 5 ? "pointer-events-none !bg-zinc-600" : ""
                }`}
              >
                Submit
              </Button>
              <p className="text-sm text-red-400">{errorResponse}</p>
            </form>
          </CardContent>
        </Card>
      </PageWrapper>
    </Suspense>
  );
};

export default Page;
