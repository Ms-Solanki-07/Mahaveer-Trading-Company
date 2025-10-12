import { AdminNavbar } from "@/components/AdminNavbar"; 
import { Footer } from "@/components/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
            <AdminNavbar />
            {children}
            <Footer />
        </>;
}
