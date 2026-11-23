import Link from "next/link";
import { redirect } from "next/navigation";
import { GalleryManager } from "../components/admin/GalleryManager";
import { getGalleryAdmin } from "@/lib/gallery-admin";

export default async function AdminPage() {
  const access = await getGalleryAdmin();
  if (access.status === 401) redirect("/sign-in");
  if (access.status === 403) redirect("/");

  return (
    <div className="min-h-screen bg-page-secondary">
      <div className="bg-page-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="py-6 text-secondary">Welcome back, {access.name}!</p>
          <nav aria-label="Admin sections" className="flex flex-wrap gap-6 border-b border-light">
            <Link href="/admin" aria-current="page" className="border-b-2 border-accent px-1 pb-4 text-sm font-medium text-primary">
              Gallery Management
            </Link>
            <Link href="/admin/quotations" className="px-1 pb-4 text-sm font-medium text-secondary hover:text-primary">
              Quotation Inbox
            </Link>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryManager />
      </div>
    </div>
  );
}
