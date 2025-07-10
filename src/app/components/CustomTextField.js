import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "#a0a0a0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#18A0FB",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
  },
}));
export default CustomTextField;
