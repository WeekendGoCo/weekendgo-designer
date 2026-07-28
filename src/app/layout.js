import "./globals.css";

export const metadata = {
  title: "WeekendGo Tours",
  description: "مصمم برامج سياحية متقدم لشركة ويكند جو",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
