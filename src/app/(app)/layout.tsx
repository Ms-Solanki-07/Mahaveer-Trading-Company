import { PublicNavbar } from "@/components/PublicNavbar";
import { Footer } from "@/components/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <PublicNavbar />
        {children}
        <Footer />
    </>;
}
