import auth from "@/libs/auth";
import { cn } from "@/libs/cn";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const tab = (await searchParams).tab;

  const currentUser = await auth.currentUser();

  return (
    <main className="max-w-5xl mx-auto">
      <section className="py-10 flex items-center justify-center">
        {currentUser.username ? (
          <button className="px-5 py-2 text-background bg-foreground hover:bg-gray-300 hover:text-gray-800 rounded-md">
            Upload
          </button>
        ) : (
          <h1 className="text-gray-500 text-center">
            <Link href={"/login"} className="underline hover:no-underline">
              Login
            </Link>{" "}
            to upload file
          </h1>
        )}
      </section>

      <section>
        {currentUser.username && (
          <div className="flex items-center gap-3">
            <Link
              href={"/"}
              className={cn(
                tab === undefined ? "" : "text-gray-500 hover:text-gray-300"
              )}
            >
              All Files
            </Link>
            <Link
              href={"/?tab=my"}
              className={cn(
                tab === "my" ? "" : "text-gray-500 hover:text-gray-300"
              )}
            >
              My Files
            </Link>
          </div>
        )}

        <div>Files</div>
      </section>
    </main>
  );
}
