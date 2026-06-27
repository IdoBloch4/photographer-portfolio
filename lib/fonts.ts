import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

// Display: variable serif with optical-size + soft axes.
// Soft axis softens edges at large sizes — fits the "warm but bold" duality.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

// Body / UI sans
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Metadata: tags, dates, EXIF, captions
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${inter.variable} ${jetbrains.variable}`;
