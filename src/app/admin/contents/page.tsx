import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import ContentsTable from "./_components/ContentsTable";

export const revalidate = 0;

export default async function ContentsPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; room?: string; status?: string; page?: string };
}) {
  const supabase = createClient();
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("contents")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchParams.q) query = query.ilike("title", `%${searchParams.q}%`);
  if (searchParams.type) query = query.eq("type", searchParams.type);
  if (searchParams.room) query = query.eq("room", searchParams.room);
  if (searchParams.status === "active") query = query.eq("is_active", true);
  if (searchParams.status === "inactive") query = query.eq("is_active", false);

  const { data: contents, count } = await query;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-ink">Quản lý nội dung</h1>
          <p className="text-muted text-sm mt-0.5">
            {count || 0} nội dung trong hệ thống
          </p>
        </div>
        <Link
          href="/admin/contents/new"
          className="inline-flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-moss-dark transition-all shadow-sm"
        >
          <Plus size={16} />
          Thêm nội dung
        </Link>
      </div>

      <ContentsTable
        contents={contents || []}
        totalPages={totalPages}
        currentPage={page}
        searchParams={searchParams}
      />
    </div>
  );
}
