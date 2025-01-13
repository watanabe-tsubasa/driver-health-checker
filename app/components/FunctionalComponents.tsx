import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { LoginData } from "~/lib/types";

interface LogoutButtonProps {
  isLoggedIn: boolean;
  user: LoginData;
}

export const LogoutButton = ({ isLoggedIn, user }: LogoutButtonProps) => {

  if (!isLoggedIn) {
    return null; // ログインしていない場合は何も表示しない
  }

  return (
    <div className="px-2 flex flex-row space-x-2 items-baseline justify-center">
      <p className="mb-2 hidden md:block">こんにちは {user.lastName}さん</p>
      <Form method="post" action="/logout">
        <Button type="submit" variant="secondary">
          ログアウト
        </Button>
      </Form>
    </div>
  );
}
