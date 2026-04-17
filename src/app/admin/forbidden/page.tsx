import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-cream-3 rounded-3xl p-8 md:p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-rose/10 text-rose rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif text-ink mb-3">
          Khu vực hạn chế
        </h1>
        
        <p className="text-muted text-[15px] mb-8 leading-relaxed">
          Bạn không có quyền truy cập vào khu vực quản trị viên. Đừng lo lắng, hãy quay lại Không gian Chữa lành của bạn nhé.
        </p>

        <Link
          href="/rooms"
          className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-moss text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-moss-dark transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          Trở về trang chính
        </Link>
      </div>
    </div>
  );
}
