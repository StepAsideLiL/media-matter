import FileUpload from "@/components/FileUpload";
import auth from "@/libs/auth";
import { cn } from "@/libs/cn";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string | undefined }>;
}) {
  const tab = (await searchParams).tab;

  const currentUser = await auth.currentUser();
  const userToken = await auth.currentUserToken();

  return (
    <main className="max-w-5xl mx-auto">
      <section className="py-10 flex items-center justify-center">
        {currentUser.username ? (
          <FileUpload userToken={userToken} />
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
