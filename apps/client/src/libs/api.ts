export default function api(route: string) {
  const baseUrl = "http://localhost:3000/";
  const formattedRoute = route.startsWith("/") ? route.slice(1) : route;
  console.log(`${baseUrl}${formattedRoute}`);

  return `${baseUrl}${formattedRoute}`;
}
