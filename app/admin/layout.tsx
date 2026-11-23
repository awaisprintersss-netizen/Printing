import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { getGalleryAdmin } from "@/lib/gallery-admin";

export const metadata: Metadata = { title: "Admin | Awais Printers", robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getGalleryAdmin();
  if (access.status === 401) redirect("/sign-in");
  if (access.status === 403) redirect("/");

  return (
    <ClerkProvider>
    <div className="min-h-screen bg-page-primary">
      <header className="bg-page-secondary shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-primary">
              Admin Panel
            </h1>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="px-4 py-2 bg-accent text-white rounded text-sm hover:opacity-90"
              >
                Back to website
              </Link>
              
              <ThemeToggle />
              
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
    </ClerkProvider>
  );
}
