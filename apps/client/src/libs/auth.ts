import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

type User =
  | {
      username: string;
    }
  | {
      username: null;
    };

function api(route: string) {
  const baseUrl = "http://localhost:3000/";
  const formattedRoute = route.startsWith("/") ? route.slice(1) : route;
  console.log(`${baseUrl}${formattedRoute}`);

  return `${baseUrl}${formattedRoute}`;
}

const currentUser = cache(async (): Promise<User> => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("media-matter-auth-token")?.value ?? null;

  if (token === null) {
    return { username: null };
  }

  const username = await fetch(api("auth/current-user"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((user) => user.username)
    .catch(() => {
      return null;
    });

  if (typeof username !== "string") {
    return { username: null };
  }

  return {
    username: username,
  };
});

// async function currentUser(): Promise<User> {
//   const cookiesStore = await cookies();
//   const token = cookiesStore.get("media-matter-auth-token")?.value ?? null;

//   if (token === null) {
//     return { username: null };
//   }

//   const username = await fetch(api("auth/current-user"), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((user) => user.username)
//     .catch(() => {
//       return null;
//     });

//   if (typeof username !== "string") {
//     return { username: null };
//   }

//   return {
//     username: username,
//   };
// }

const loginUser = cache(async (username: string) => {
  const token = await fetch(api("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.token)
    .catch(() => null);

  console.log(token);

  if (token === null) {
    return {
      success: false,
    };
  }

  const cookiesStore = await cookies();
  cookiesStore.set("media-matter-auth-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return {
    success: true,
  };
});

// async function loginUser(username: string) {
//   const token = await fetch(api("/auth/login"), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username,
//     }),
//   })
//     .then((res) => res.json())
//     .then((res) => res.token)
//     .catch(() => null);

//   console.log(token);

//   if (token === null) {
//     return {
//       success: false,
//     };
//   }

//   const cookiesStore = await cookies();
//   cookiesStore.set("media-matter-auth-token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//   });

//   return {
//     success: true,
//   };
// }

const auth = {
  currentUser,
  loginUser,
};

export default auth;
