import ContentForm from "../_components/ContentForm";

export default function NewContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-ink">Thêm nội dung mới</h1>
        <p className="text-muted text-sm mt-0.5">Tạo nội dung mới cho Healing Space</p>
      </div>
      <ContentForm />
    </div>
  );
}
