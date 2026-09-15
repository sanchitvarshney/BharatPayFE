import React, { useEffect, useMemo, useState } from "react";
import {
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import {
  CustomDrawer,
  CustomDrawerContent,
  CustomDrawerFooter,
  CustomDrawerHeader,
  CustomDrawerTitle,
} from "@/components/reusable/CustomDrawer";
import { Icons } from "@/components/icons";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";
import { ComponentType } from "@/components/reusable/SelectComponent";

type Props = {
  value: ComponentType[];
  onChange: (value: ComponentType[]) => void;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
};

const SelectMultipleComponentsDrawer: React.FC<Props> = ({
  value,
  onChange,
  label = "Select Component",
  width = "100%",
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState<ComponentType[]>([]);
  const [draftSelected, setDraftSelected] = useState<
    Map<string, ComponentType>
  >(new Map());
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const fetchItems = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/backend/search/item/${query ?? ""}`,
      );
      setItemList(response.data.data ?? []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchItems(debouncedInputValue || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputValue, open]);

  const handleOpen = () => {
    setDraftSelected(new Map(value.map((item) => [item.id, item])));
    setInputValue("");
    setShowSelectedOnly(false);
    setOpen(true);
  };

  const toggleItem = (item: ComponentType) => {
    setDraftSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, item);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setDraftSelected((prev) => {
      const next = new Map(prev);
      itemList.forEach((item) => next.set(item.id, item));
      return next;
    });
  };

  const handleClearAll = () => {
    setDraftSelected(new Map());
  };

  const handleApply = () => {
    onChange(Array.from(draftSelected.values()));
    setOpen(false);
  };

  const selectedList = useMemo(
    () => Array.from(draftSelected.values()),
    [draftSelected],
  );
  const visibleList = showSelectedOnly ? selectedList : itemList;

  return (
    <>
      <div
        onClick={handleOpen}
        className={`w-full min-h-[56px] rounded-[4px] border px-[14px] py-[8px] flex items-center justify-between cursor-pointer hover:bg-neutral-50 ${error ? "border-red-500" : "border-neutral-400"}`}
        style={{ width }}
      >
        <div className="flex flex-col">
          <span className="text-[12px] text-neutral-500">{label}</span>
          <span className="text-[14px] text-slate-700">
            {value.length
              ? `${value.length} component${value.length > 1 ? "s" : ""} selected`
              : "Click to select components"}
          </span>
        </div>
        <Icons.search fontSize="small" className="text-neutral-500" />
      </div>
      {error && helperText && (
        <span className="text-[12px] text-red-500 ml-[14px]">{helperText}</span>
      )}

      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent
          side="right"
          className="min-w-[480px] p-0 flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <CustomDrawerHeader className="h-[56px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-100 gap-0 shrink-0">
            <CustomDrawerTitle className="text-slate-700 font-[500] p-0 text-[16px]">
              Select Components
            </CustomDrawerTitle>
          </CustomDrawerHeader>

          <div className="p-[16px] flex flex-col gap-[10px] shrink-0 border-b border-neutral-200">
            <TextField
              autoFocus
              size="small"
              fullWidth
              placeholder="Search component by name or part code"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Icons.search fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[8px]">
                <Button
                  type="button"
                  variant="outline"
                  className="h-[30px] px-[10px] text-[12px]"
                  onClick={handleSelectAllVisible}
                >
                  Select all in view
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-[30px] px-[10px] text-[12px]"
                  onClick={handleClearAll}
                >
                  Clear all
                </Button>
              </div>
              <Chip
                size="small"
                clickable
                color={showSelectedOnly ? "primary" : "default"}
                label={`${selectedList.length} selected`}
                onClick={() => setShowSelectedOnly((prev) => !prev)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && !showSelectedOnly ? (
              <div className="flex items-center justify-center h-[120px]">
                <CircularProgress size={24} />
              </div>
            ) : visibleList.length === 0 ? (
              <div className="flex items-center justify-center h-[120px]">
                <Typography className="text-neutral-400 text-[13px]">
                  {showSelectedOnly
                    ? "No components selected"
                    : "No components found"}
                </Typography>
              </div>
            ) : (
              <List dense disablePadding>
                {visibleList.map((item) => {
                  const checked = draftSelected.has(item.id);
                  return (
                    <ListItemButton
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className="border-b border-neutral-100"
                    >
                      <Checkbox
                        edge="start"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple
                        size="small"
                      />
                      <ListItemText
                        primary={
                          <span className="text-[13px]">{`(${item.part_code})-${item.text}`}</span>
                        }
                      />
                      {checked && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item);
                          }}
                        >
                          <Icons.close fontSize="small" />
                        </IconButton>
                      )}
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </div>

          <CustomDrawerFooter className="p-[16px] border-t border-neutral-200 shrink-0 flex-row justify-between items-center">
            <div className="flex gap-[10px]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </CustomDrawerFooter>
        </CustomDrawerContent>
      </CustomDrawer>
    </>
  );
};

export default SelectMultipleComponentsDrawer;
