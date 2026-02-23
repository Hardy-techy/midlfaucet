import { Providers } from "./providers";
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
