import { redirect } from "@remix-run/cloudflare";

export const action = async () => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `user=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};

export const loader = async () => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `user=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};


export default function LogoutPage() {
  return null;
}
