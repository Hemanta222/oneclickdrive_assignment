"use client";
import { useContextData } from "@/context/Context";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CustomTextField from "../components/CustomTextField";
import Link from "next/link";
import { getUserDetails, register } from "@/lib/actions";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { displayMessage ,setUserData} = useContextData();

    const signupHandler = async (e) => {
      e.preventDefault();
      try {
        const response = await register(email, password);
        if (response.success) {
  
          const data = await getUserDetails();
          setUserData({ userId: data?.user?.userId, email: data?.user?.email });
  
          router.push("/dashboard");
          displayMessage(response?.message || "Success", "success");
        } else {
          displayMessage(response.message, "error");
        }
      } catch (error) {
        displayMessage(error.message, "error");
      }
    };


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
      component="form"
      onSubmit={signupHandler}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: 2,
          borderRadius: "16px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          fontWeight={600}
          mb={2}
        >
          Signup
        </Typography>
        <CustomTextField
          id="email"
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          placeholder="enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CustomTextField
          type="password"
          id="password"
          label="Password"
          variant="outlined"
          fullWidth
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            py: 1.5,
            mt: 2,
            borderRadius: "24px",
            fontSize: ".9rem",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .2)",
          }}
        >
          Signup
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" component="span" sx={{ mr: 0.5 }}>
            Already register!
          </Typography>
          <Link href="/login" style={{ color: "#18A0FB", fontWeight: 500 }}>
            Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
