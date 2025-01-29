"use client";

import { loginUser } from "@/libs/actions/login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    if (username === "") {
      setError("Username is required");
      return;
    }

    const res = await loginUser(username);

    if (res.success) {
      router.push("/");
      setLoading(false);
    } else {
      setError("Failed to login");
      setLoading(false);
    }
  }

  return (
    <main className="h-96 flex items-center justify-center flex-col gap-5">
      <Link href={"/"} className="font-mono font-bold text-xl">
        Media Matter
      </Link>

      <form action="" className="w-96 space-y-8 border border-gray-800 p-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="block w-full p-2 bg-background text-foreground border border-gray-800 focus-within:outline-none focus-within:border-foreground"
            value={username}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setError("");
              setUsername(event.target.value);
            }}
          />
          {error !== "" && <p className="text-red-500">{error}</p>}
        </div>
        <button
          type="button"
          className="block py-2 px-5 bg-foreground text-background cursor-pointer disabled:bg-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed"
          disabled={loading}
          onClick={handleSubmit}
        >
          Login
        </button>
      </form>
    </main>
  );
}
