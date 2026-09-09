import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";

type MultiSelectProps<T> = {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  width?: string;
  limitTags?: number;
  /** Server-side search (debounced). Omit for a one-shot list + client filtering. */
  search?: (query: string | null) => Promise<T[]>;
  /** One-shot fetch of the whole option list. */
  loadAll?: () => Promise<T[]>;
};

/**
 * Multi-select autocomplete that shows the first `limitTags` chips inline and
 * collapses the rest into a "+N" chip which opens a manage-selection dialog.
 */
function MultiSelect<T>({
  label,
  value,
  onChange,
  getOptionLabel,
  isOptionEqualToValue,
  width = "100%",
  limitTags = 4,
  search,
  loadAll,
}: MultiSelectProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const removeOption = (option: T) =>
    onChange(value.filter((item) => !isOptionEqualToValue(option, item)));

  const runFetch = useCallback(async (fn: () => Promise<T[]>) => {
    setLoading(true);
    try {
      setOptions(await fn());
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loadAll) runFetch(loadAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (search && debouncedInputValue) runFetch(() => search(debouncedInputValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputValue]);

  return (
    <>
      <Autocomplete
        multiple
        size="small"
        value={value}
        options={options}
        onFocus={() => search && runFetch(() => search(null))}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        {...(search ? { filterOptions: (opts: T[]) => opts } : {})}
        filterSelectedOptions
        loading={loading}
        onChange={(_, next) => onChange(next as T[])}
        onInputChange={(_, next, reason) => {
          if (reason === "input" || reason === "clear") setInputValue(next);
        }}
        renderTags={(selected, getTagProps) => {
          const shown = selected.slice(0, limitTags);
          const hidden = selected.length - shown.length;
          return (
            <>
              {shown.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    size="small"
                    label={getOptionLabel(option)}
                    {...tagProps}
                  />
                );
              })}
              {hidden > 0 && (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={`+${hidden}`}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOverflowOpen(true);
                  }}
                />
              )}
            </>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{ width, minWidth: width }}
      />

      <Dialog open={overflowOpen} onClose={() => setOverflowOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          {label} ({value.length})
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List dense>
            {value.map((option, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" size="small" onClick={() => removeOption(option)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={getOptionLabel(option)}
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setOverflowOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MultiSelect;
