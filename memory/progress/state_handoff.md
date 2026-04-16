# Project State Handoff
Date: 2026-04-16

## Tôi đang ở đâu

**Giai đoạn 7: Đồng bộ dữ liệu & Profile — HOÀN THÀNH**

### Tổng kết chuỗi hoàn thành:
- Phase 6: Auth UI (Login/Register/Logout) ✅
- Phase 7: Đồng bộ user data từ localStorage lên Supabase (Gratitude, Mood) & Trang Profile ✅

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

1. NEXT STEP (Phase 8): Hoàn thiện các components khác hoặc trang Admin Dashboard.
2. Vẫn chưa có GitHub remote — nếu cần deploy hoặc push, hãy add remote repository.
