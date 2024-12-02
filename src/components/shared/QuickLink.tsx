import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { CircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppSelector } from "@/hooks/useReduxHook";

interface MenuItem {
  menu_key: string;
  name: string;
  url: string | null;
  children?: MenuItem[];
}

interface Link {
  href: string;
  label: string;
  value: string;
}

function convertMenuToLinks(menu: MenuItem[]): Link[] {
  const links: Link[] = [];

  function traverseMenu(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.url) {
        links.push({
          href: item.url,
          label: item.name,
          value: item.name.toLowerCase().replace(/\s+/g, "-"), // Generate a "value" field
        });
      }

      if (item.children && item.children.length > 0) {
        traverseMenu(item.children);
      }
    });
  }

  traverseMenu(menu);
  return links;
}
export default function QuickLink({ ...props }: DialogProps) {
  const { menu } = useAppSelector((state) => state.menu);
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
      <Button className="bg-white h-[40px] text-slate-600 w-[300px]  text-start flex items-start justify-between hover:bg-white hover:text-slate-600" onClick={() => setOpen(true)} {...props}>
        <div className="w-full">
          {" "}
          <span className="hidden lg:inline-flex">Quick links...</span>
        </div>
        <kbd className="pointer-events-none text-xs   hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>f
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {menu &&
              convertMenuToLinks(menu)?.map((item) => (
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
