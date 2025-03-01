import api from "@/libs/api";
import auth from "@/libs/auth";
import Image from "next/image";

export default async function AllFiles({ tab }: { tab: string | undefined }) {
  const token = await auth.currentUserToken();
  const user = await auth.currentUser();

  const files = await fetch(api("/all-files"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tab: tab === "my" ? "my" : "all",
      userId: user.userId,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.filesUrl);

  return (
    <div className="flex items-center gap-2">
      {files.map((fileUrl: string) => (
        <Image
          key={fileUrl}
          src={fileUrl}
          alt="file"
          width={200}
          height={200}
        />
      ))}
    </div>
  );
}
