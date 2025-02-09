import { CalendarIcon, Check, X } from "lucide-react"
import { cn, convertJSTToUTCDate } from "~/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Input } from "~/components/ui/input"
import { Suspense, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Store } from "~/lib/types"
import { Await } from "@remix-run/react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"

export const StoreSearchCombobox = ({ storesPromise }: { storesPromise: Promise<Store[]> }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
        店舗名
      </label>
      <Suspense fallback={
        <Input
         className="h-9 w-full"
         type="text"
         defaultValue="店名を入力"      
        />
      }>
        <Await resolve={ storesPromise }>
          {(stores) => (<Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div>
                <Input
                  id="storeName"
                  name="storeName"
                  type="text"
                  role="combobox"
                  aria-expanded={open}
                  value={value}
                  onChange={() => {}} // 別途onChangeはpop overで制御
                  placeholder="店名を入力"
                  required
                />
                {/* 実際に送信するのは store_code */}
                <input type="hidden" name="storeCode" value={stores.find((store) => store.label === value)?.value || ""} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="店名を入力" className="h-9" />
                <CommandList>
                  <CommandEmpty>店舗が見つかりませんでした</CommandEmpty>
                  <CommandGroup>
                    {stores.map((store) => (
                      <CommandItem
                        key={store.value}
                        value={store.label} // 🔹 ここを store_name に変更
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        {store.label}
                        <Check className={cn("ml-auto", value === store.label ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>)}
        </Await>
      </Suspense>
    </div>
  );
};

export const StoreSearchComboboxNolabel = ({ storesPromise }: { storesPromise: Promise<Store[]> }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-2">
      <Suspense fallback={
        <Input
         className="h-9 w-full flex-1"
         type="text"
         defaultValue="店名を入力"
        />
      }>
        <Await resolve={ storesPromise }>
          {(stores) => (<Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex-1">
                <Input
                  id="storeName"
                  name="storeName"
                  type="text"
                  role="combobox"
                  aria-expanded={open}
                  value={value}
                  onChange={() => {}} // 別途onChangeはpop overで制御
                  placeholder="店名を入力"
                  className="flex-1"
                />
                {/* 実際に送信するのは store_code */}
                <input
                 type="hidden"
                 name="storeCode"
                 value={stores.find((store) => store.label === value)?.value || ""}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="店名を入力" className="h-9" />
                <CommandList>
                  <CommandEmpty>店舗が見つかりませんでした</CommandEmpty>
                  <CommandGroup>
                    {stores.map((store) => (
                      <CommandItem
                        key={store.value}
                        value={store.label} // 🔹 ここを store_name に変更
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        {store.label}
                        <Check className={cn("ml-auto", value === store.label ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>)}
        </Await>
      </Suspense>
      <Button
       variant="ghost"
       type="button"
       size="icon"
       onClick={() => setValue("")}>
        <X />
      </Button>
    </div>
  );
};

export const ManagerRoleSelect = ({ onChange }: { onChange: (role: string) => void }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
        役職
      </label>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="役職を選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="store_manager">店長</SelectItem>
          <SelectItem value="ns_manager">NSマネージャー</SelectItem>
          <SelectItem value="leader">配送リーダー</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const DatePickerWithRange = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const today = new Date(); // 当日
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 月初
  const [date, setDate] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: today,
  });
 
  return (
    <div className={cn(" gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div>
        {/* 実際に送信するfrom to */}
        <input
          id="startDate"
          name="startDate"
          type="hidden"
          value={convertJSTToUTCDate(date?.from)?.toISOString() || ""} // ✅ 空文字を追加
          onChange={() => {}} // 別途onChangeはpop overで制御
          required
        />
        <input
          id="endDate"
          name="endDate"
          type="hidden"
          value={convertJSTToUTCDate(date?.to)?.toISOString() || ""} // ✅ 空文字を追加
          onChange={() => {}} // 別途onChangeはpop overで制御
          required
        />
      </div>
    </div>
  )
}