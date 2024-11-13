import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
 
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "gray", // Default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#404040", // Focused label color
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "#a3a3a3", // Default underline color
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "#a3a3a3", // Hover underline color
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#a3a3a3", // Focused underline color
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          fontSize: "0.830rem", // Set your desired global font size for dropdown options
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.830rem", // Set your desired font size here
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          fontSize: "0.830rem", // Adjust the size as needed
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "0.830rem", // Adjust the size as needed
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "12px", // Global font size for placeholder
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "13px", // Set your global font size here
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: "2px", // Global border width
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a8a29e", // Change border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#115e59", // Change border color when focused
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "12px", // Global font size for buttons
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#22d3ee", // Light teal
      main: "#0891b2", // Main teal
      dark: "#0e7490", // Dark teal
      contrastText: "#fff",
    },
    secondary: {
      light: "#e5e5e5", // Light secondary teal
      main: "#d4d4d8", // Main secondary teal
      dark: "#1de9b6", // Dark secondary teal
      contrastText: "#000",
    },
  },
});

export default theme;
