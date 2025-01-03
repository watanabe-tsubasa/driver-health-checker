import * as React from "react"
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

const stores = [
  {
    value: "イオン東雲店",
    label: "イオン東雲店",
  },
  {
    value: "イオン船橋店",
    label: "イオン船橋店",
  },
]

export default function StoreSearchCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <>
      <label
       htmlFor="storeName"
       className="block text-sm font-medium text-gray-700"
      >
        店舗名
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            type="text"
            role="combobox"
            aria-expanded={open}
            value={value
              ? stores.find((store) => store.value === value)?.label
              : ""}
            // <ChevronsUpDown className="opacity-50" />
            placeholder="店名を入力"
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
    </>
  )
}
