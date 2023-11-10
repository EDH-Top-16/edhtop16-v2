import "./globals.css";
import ContextProvider from "@/context/context";
import { ReduxProvider } from "@/store/provider";

/**
 * This file is the root layout for the entire application.
 */

// TODO: add proper metadata
export const metadata = {
  title: "EDH Top 16",
  description: "Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen bg-secondary">
        <ReduxProvider>
          <ContextProvider>{children}</ContextProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
