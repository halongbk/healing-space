import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = createClient();
  
  // Test connection bằng getUser(), API này call server-to-server check session
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4 font-serif text-moss-dark">✅ Supabase Connection Test</h1>
      
      {error && !error.message.includes('Auth session missing') ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-bold mb-2">Lỗi kết nối:</p>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div className="bg-moss-light text-moss-dark p-6 rounded-xl border border-moss/30 shadow-sm">
          <p className="font-medium mb-2">Trạng thái: Kết nối Thành công!</p>
          <p className="text-sm text-moss mb-4">Giao tiếp với Supabase qua SSR hoạt động hoàn hảo. Auth helper đã nhận lệnh.</p>
          
          <div className="bg-white/60 p-4 rounded-lg">
            <p className="font-medium mb-1">User Status:</p>
            <pre className="text-xs">{JSON.stringify({ user: user || "Chưa Auth (Không có Session)" }, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
