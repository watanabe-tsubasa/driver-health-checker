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
import { SetStateAction, useState } from "react"

const stores = [
  {
    value: "イオン東雲店",
    label: "イオン東雲店",
  },
  {
    value: "イオン船橋店",
    label: "イオン船橋店",
  },
  {
    value: "イオンスタイル幕張新都心",
    label: "イオンスタイル幕張新都心",
  },
  {
    value: "イオン海浜幕張店",
    label: "イオン海浜幕張店",
  },
  {
    value: "イオンスタイル品川シーサイド",
    label: "イオンスタイル品川シーサイド",
  },
  {
    value: "イオンスタイル金剛",
    label: "イオンスタイル金剛",
  },
  {
    value: "イオン鎌ケ谷店",
    label: "イオン鎌ケ谷店",
  },
  {
    value: "イオンスタイル甲府昭和",
    label: "イオンスタイル甲府昭和",
  },
]

export const StoreSearchCombobox = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className="space-y-2">
      <label
       htmlFor="storeName"
       className="block text-sm font-medium text-gray-700"
      >
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
            value={value
              ? stores.find((store) => store.value === value)?.label
              : ""}
            onChange={() => {return}}
            placeholder="店名を入力"
            required
          >
          </Input>
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
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {store.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === store.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface StoreSearchComboboxWithValueStateProps{
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
}

export const StoreSearchComboboxWithValueState = ({
  value, setValue
}: StoreSearchComboboxWithValueStateProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label
       htmlFor="storeName"
       className="block text-sm font-medium text-gray-700"
      >
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
            value={value
              ? stores.find((store) => store.value === value)?.label
              : ""}
            onChange={() => {return}}
            placeholder="店名を入力"
            required
          >
          </Input>
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
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {store.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === store.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}