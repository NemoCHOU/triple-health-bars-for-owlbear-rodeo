import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InputName } from "@/statInputHelpers";
import { InputHTMLAttributes } from "react";

export default function StatStyledInput({
  name,
  inputProps,
}: {
  name: InputName;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Input
          {...inputProps}
          name={name}
          className={cn(
            "h-[32px]",
            "w-[60px]",
            {
              "bg-stat-red/10 dark:bg-stat-red-dark/5":
                name === "health" ||
                name === "maxHealth" ||
                name === "health2" ||
                name === "maxHealth2" ||
                name === "health3" ||
                name === "maxHealth3",
              "bg-stat-green/10 dark:bg-stat-green-dark/5":
                name === "tempHealth" ||
                name === "tempHealth2" ||
                name === "tempHealth3",
              "bg-stat-blue/10 dark:bg-stat-blue-dark/5": name === "armorClass",
            },
            inputProps?.className,
          )}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{nameToLabel(name)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

const nameToLabel = (name: InputName) => {
  switch (name) {
    case "health":
      return "Current Hit Points";
    case "maxHealth":
      return "Hit Points Maximum";
    case "tempHealth":
      return "Temporary Hit Points";
    case "health2":
      return "Current Hit Points 2";
    case "maxHealth2":
      return "Hit Points 2 Maximum";
    case "tempHealth2":
      return "Temporary Hit Points 2";
    case "health3":
      return "Current Hit Points 3";
    case "maxHealth3":
      return "Hit Points 3 Maximum";
    case "tempHealth3":
      return "Temporary Hit Points 3";
    case "armorClass":
      return "Armor Class";
    case "hideStats":
      return "Stats Visibility";
  }
};
