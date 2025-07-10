import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AppProvider from "./AppProvider";
import AlertMessage from "./components/AlertMessage";
import ResponsiveAppBar from "./components/AppToolbar";
import { getUserDetails } from "@/lib/actions";

export const metadata = {
  title: "One Click Drive App",
  description: "Developed by Hemanta Das",
};

export default async function RootLayout({ children }) {
  const data = await getUserDetails();

  return (
    <html lang="en">
      <body>
        <AppProvider userDetails={data.user}>
          <ResponsiveAppBar />
          {children}
          <AlertMessage />
        </AppProvider>
      </body>
    </html>
  );
}
