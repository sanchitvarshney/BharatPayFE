export const IMAGE_VIEWS = [
  { key: "frontImage", label: "Front" },
  { key: "backImage", label: "Back" },
  { key: "leftSide", label: "Left Side" },
  { key: "rightSide", label: "Right Side" },
  { key: "topView", label: "Top View" },
  { key: "bottomView", label: "Bottom View" },
  { key: "deviceView", label: "Device View" },
  { key: "boxView", label: "Box View" },
] as const;

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgb(203 213 225)" },
    "&:hover fieldset": { borderColor: "rgb(148 163 184)" },
    "&.Mui-focused fieldset": { borderColor: "rgb(14 116 144)" },
  },
};

export const selectSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgb(203 213 225)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgb(148 163 184)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgb(14 116 144)",
  },
};
