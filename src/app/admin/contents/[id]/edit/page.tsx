import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ContentForm from "../../_components/ContentForm";

export default async function EditContentPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: content, error } = await supabase
    .from("contents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !content) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-ink">Sửa nội dung</h1>
        <p className="text-muted text-sm mt-0.5 truncate max-w-md">{content.title}</p>
      </div>
      <ContentForm existing={content} />
    </div>
  );
}
