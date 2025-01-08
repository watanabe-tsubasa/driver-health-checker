import { Link } from "@remix-run/react";
import { useState } from "react";
import { StoreSearchComboboxWithValueState } from "~/components/FormUI";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function Index() {
  const [storeName, setStoreName] = useState('')
  return (
    <div className="h-screen-header w-full flex justify-center items-start p-2">
      <Card className="h-full w-full flex justify-center items-center">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-10">
            <Link to='/driver/start' className="w-full">
              <Button className="w-full">
                出発前登録
              </Button>
            </Link>
            <Separator />
            <div className="flex flex-col items-center justify-center space-y-2">
              <StoreSearchComboboxWithValueState value={storeName} setValue={setStoreName} />
              <Link to={`/driver/end/store-select/table?storeName=${storeName}`} className="w-full">
                <Button className="w-full">
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
