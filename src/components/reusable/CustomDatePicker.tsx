import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CustomDatePickerProps {
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  initialDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

export default function CustomDatePicker({ label = "Select Date",  className = "", buttonClassName = "", initialDate, onDateChange }: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [isFocused, setIsFocused] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const today = new Date();
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button ref={buttonRef} variant={"outline"} className={cn("w-full h-[40px] justify-start text-left font-normal relative border-0 border-slate-300 border-b rounded-none hover:bg-transparent text-slate-600", !date && "text-muted-foreground", buttonClassName)}>
            {date ? format(date, "PPP") : null}
            <div className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 text-sm transition-all flex items-center", date || isFocused ? " top-[-8px] bg-white " : "text-muted-foreground")}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              {label}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={{ after: today }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
