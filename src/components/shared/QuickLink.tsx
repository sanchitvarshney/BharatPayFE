import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { CircleIcon } from "lucide-react";

import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { navLinks } from "@/data/SidebarMenuData";

export default function QuickLink({ ...props }: DialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "f" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if ((e.target instanceof HTMLElement && e.target.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button variant="outline" className={cn("relative h-[40px] w-[350px] justify-start rounded-[0.5rem] bg-white text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64")} onClick={() => setOpen(true)} {...props}>
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[10px] top-[10px] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>f
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {navLinks.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  runCommand(() => navigate(item.href as string));
                }}
                className="pointer-events-auto data-[disabled]:pointer-events-auto data-[disabled]:opacity-70 cursor-pointer aria-selected:bg-zinc-200"
              >
                <div className="flex items-center justify-center w-4 h-4 mr-2">
                  <CircleIcon className="w-3 h-3" />
                </div>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
