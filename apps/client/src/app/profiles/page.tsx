import api from "@/libs/api";

export default async function Page() {
  const users: {
    id: number;
    username: string;
  }[] = await fetch(api("/profiles")).then((res) => res.json());

  return (
    <main className="max-w-5xl mx-auto">
      <div className="pt-5 border-b border-gray-500">
        <h1 className="text-2xl">Profiles</h1>
      </div>

      <div className="pt-5">
        {users.map((user) => (
          <h1 key={user.id} className="text-xl">
            {user.username}
          </h1>
        ))}
      </div>
    </main>
  );
}
