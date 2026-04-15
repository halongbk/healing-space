import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* === Google Fonts với next/font (tối ưu tải font) === */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/* === SEO Metadata === */
export const metadata: Metadata = {
  title: "Healing Space — Không gian chữa lành",
  description:
    "Nền tảng thư giãn và chữa lành cho nhân viên căng thẳng. Hít thở, thiền định, sáng tạo và tái tạo năng lượng.",
  keywords: ["healing", "meditation", "relaxation", "wellness", "mindfulness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
