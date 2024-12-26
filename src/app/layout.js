import "./globals.css";

export const metadata = {
  title: "Popcat Clicker Game",
  description: "Popcat Clicker Game Created by skiprez",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
