import "./globals.css";

export const metadata = {
  title: "Clicker Game",
  description: "Clicker Game",
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
