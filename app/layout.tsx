"use client";

import "./globals.css";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";

Amplify.configure(
  {
    ...config,
    API: {
      REST: {
        test: {
          endpoint:
            "https://abcdefghij1234567890.execute-api.us-east-1.amazonaws.com/dev",
        },
      },
    },
  },
  { ssr: true }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
