# Project State Handoff
Date: 2026-04-16

## Tôi đang ở đâu

**Giai đoạn 3: Trang Quản Trị & Cơ Chế Túi Mù — ĐANG CHỜ IMPLEMENT**

### Tổng kết chuỗi dự án:
- Phase 6 (Giai đoạn 2): Auth UI (Login/Register/Logout) ✅
- Phase 7 (Giai đoạn 2): Đồng bộ user data từ localStorage lên Supabase (Gratitude, Mood) & Trang Profile ✅
- Phase 8-10 (Giai đoạn 3): CMS cho Admin, API Túi mù & Animation giao diện ⏳ (Chưa Bắt Đầu)

### File đã tạo/sửa trong Phase 7:
- `src/hooks/useUser.ts` — Lấy thông tin user (từ auth và bảng users)
- `src/hooks/useGratitude.ts` — Quản lý Hũ Biết Ơn (Supabase CRUD)
- `src/hooks/useMoodSession.ts` — Quản lý Mood (Lưu vào user_sessions)
- `src/components/rooms/FeelRoom.tsx` — Migrate từ localStorage sang dùng useGratitude() (Cloud), UI cho banner migration đồng bộ data cũ
- `src/components/layout/Sidebar.tsx` — Cập nhật logic mood tracking (dùng useMoodSession)
- `src/app/profile/page.tsx` — Tạo trang Hồ sơ cá nhân (hiển thị email, update Tên hiển thị)
- `src/middleware.ts` — Thêm route `/profile` vào danh sách bảo vệ
- `src/components/layout/Topbar.tsx` — Thêm nút "Hồ sơ cá nhân" vào menu dropdown của User

---

## Decisions

- Đồng bộ dữ liệu (migration): Nếu vào FeelRoom mà thấy có data cũ ở localStorage, sẽ hiển thị một banner thông báo hỏi user có muốn đồng bộ lên Cloud không. Khi user bấm đồng bộ, dùng vòng lặp để addEntry tường minh.
- Fetch Data: Dùng custom hooks ở Client Components để xử lý optimistic updates cho mượt mà (VD: Thêm vào hũ biết ơn -> hiện ngay lập tức).
- Profile Form: Email là readonly, chỉ cho phép update Tên hiển thị (display_name). Update tiến hành song song ở Auth metadata và Table `users`.

---

## Messages for next Agent:

1. NEXT STEP (Giai đoạn 3): Bắt đầu tiến hành tạo Admin Dashboard, API túi mù bằng cách đọc kỹ tuần tự các bước 9-13 trong file `PHASE_3_TODO.md`. Vui lòng thực hiện từng bước thay vì đôm đốp làm toàn bộ.
2. Code đang trên Vercel tại branch `main`. Hãy giữ thói quen sử dụng branch này và commit/push lên github bằng các lệnh an toàn. Mọi API call tới DB sử dụng `@supabase/ssr` thông qua actions Server/Clients như quy trình Giai đoạn 2 đã làm trước đó.
3. Không làm hỏng app. Giai đoạn 2 đang chạy mượt, 0 warnings và 0 errors trên Vercel build. Test build định kì thường xuyên nếu bạn thấy nghi ngờ.
