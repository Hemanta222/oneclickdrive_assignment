import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", // Slightly more rounded corners
    backgroundColor: "#f0f0f0", // Light grey background for the input area
    "& fieldset": {
      borderColor: "transparent", // No border by default
    },
    "&:hover fieldset": {
      borderColor: "#a0a0a0", // Subtle hover border
    },
    "&.Mui-focused fieldset": {
      borderColor: "#18A0FB", // Focus border color
      borderWidth: "2px", // Thicker focus border
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px", // Adjust padding for a cleaner look
  },
}));
export default CustomTextField;
