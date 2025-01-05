import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function Index() {
  return (
    <Card className="h-screen-header flex justify-center items-center">
      <Link to='/driver'>
        <Button>
          体調を登録する
        </Button>
      </Link>
    </Card>
  );
}
