"use client";

import React, { createContext, useContext, useState } from "react";

export const Context = createContext();

export const Provider = ({ children, userDetails }) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");

  const [userData, setUserData] = useState({
    userId: userDetails?.userId || 0,
    email: userDetails?.email || "",
  });

  const displayMessage = (message, severity) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };
  const closeMessage = () => {
    setMessage("");
    setOpen(false);
  };
  const values = {
    message,
    severity,
    open,
    displayMessage,
    closeMessage,
    userData,
    setUserData,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export function useContextData() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("context error");
  }
  return context;
}
