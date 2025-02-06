import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function Index() {
  return (
    <div className="h-screen-header w-full flex justify-center items-start p-2">
      <Card className="h-full w-full max-w-md flex justify-center items-center">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-10">
            <Link to='/driver/start' className="w-full">
              <Button className="w-40 h-40 rounded-full bg-gradient-radial from-[#31C300] to-[#44FF06] shadow-lg">
                出発前登録
              </Button>
            </Link>
            <Separator />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Link to='/driver/end/store-select/' className="w-full">
                <Button className="w-40 h-40 rounded-full bg-gradient-radial from-[#c30000] to-[#ff0606] shadow-lg">
                  帰着後登録
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
