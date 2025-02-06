import { Check } from "lucide-react"

import { cn } from "~/lib/utils"
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
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Store } from "~/lib/types"

export const StoreSearchCombobox = ({ stores }: { stores: Store[] }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
        店舗名
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              id="storeName"
              name="storeName"
              type="text"
              role="combobox"
              aria-expanded={open}
              value={value}
              onChange={() => {}}
              placeholder="店名を入力"
              required
            />
            {/* 実際に送信するのは store_code */}
            <input type="hidden" name="storeCode" value={stores.find((store) => store.label === value)?.value || ""} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
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
      </Popover>
    </div>
  );
};



export const StoreSearchComboboxWithValueState = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  // 🔹 API から店舗リストを取得
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("店舗情報の取得に失敗しました");
        const data: Store[] = await response.json();
        setStores(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="space-y-2">
      <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
        店舗名
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            id="storeName"
            name="storeName"
            type="text"
            role="combobox"
            aria-expanded={open}
            value={value ? stores.find((store) => store.value === value)?.label : ""}
            onChange={() => {}}
            placeholder="店名を入力"
            required
          />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="店名を入力" className="h-9" />
            <CommandList>
              <CommandEmpty>店舗が見つかりませんでした</CommandEmpty>
              <CommandGroup>
                {stores.map((store) => (
                  <CommandItem
                    key={store.value}
                    value={store.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {store.label}
                    <Check className={cn("ml-auto", value === store.value ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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