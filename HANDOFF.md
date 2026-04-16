# HEALING SPACE — HANDOFF Giai đoạn 2 → Giai đoạn 3
Ngày: 2026-04-16

## Tổng quan

Giai đoạn 2 đã hoàn chỉnh toàn bộ hệ thống **Authentication + Database + Data Sync**. Dự án sẵn sàng cho Giai đoạn 3.

---

## Những gì đã xong trong Giai đoạn 2

### Auth System
- Đăng ký (`/register`): Form 4 fields, client validation, success screen "kiểm tra email"
- Đăng nhập (`/login`): 2-column layout, show/hide password, error messages tiếng Việt
- Đăng xuất: Topbar dropdown → `signOut()` → redirect `/login`
- Session persistence: Cookie-based qua `@supabase/ssr`
- Route protection: Middleware bảo vệ `/rooms`, `/profile`, `/dashboard`
- Smart redirect: `/` check auth → `/rooms` hoặc `/login`

### Database (Supabase)
8 bảng, **RLS bật trên TẤT CẢ**:

| Bảng | Mục đích | RLS |
|------|----------|-----|
| `users` | Profile người dùng (display_name, role, group_id...) | ✅ |
| `user_groups` | Phân nhóm nhân viên (4 nhóm mặc định) | ✅ |
| `user_sessions` | Log session + mood theo phòng | ✅ |
| `gratitude_entries` | Hũ biết ơn (text + created_at) | ✅ |
| `contents` | Nội dung phòng (affirmation, quote, story, image...) | ✅ |
| `journal_releases` | Đếm số lần "thả" Journal (không lưu nội dung) | ✅ |
| `gratitude_jar` | (Legacy) Hũ biết ơn cũ — sẽ deprecate | ✅ |
| `mood_logs` | (Legacy) Mood cũ — sẽ deprecate | ✅ |

### Data Sync
- Gratitude: `localStorage` → **Supabase cloud** (có migration banner cho data cũ)
- Mood tracking: Sidebar emoji → bảng `user_sessions`
- Profile: `/profile` page  — xem và cập nhật `display_name`

---

## Custom Hooks đã tạo

| Hook | File | Chức năng |
|------|------|-----------|
| `useUser()` | `src/hooks/useUser.ts` | Lấy auth user + profile từ bảng `users`, có cache ref |
| `useGratitude()` | `src/hooks/useGratitude.ts` | CRUD Hũ Biết Ơn (fetch, add, delete) + optimistic update |
| `useMoodSession()` | `src/hooks/useMoodSession.ts` | Lưu mood + đọc mood gần nhất từ `user_sessions` |

---

## Server Actions

File: `src/app/login/actions.ts`

- `login(formData)` → `signInWithPassword()` → redirect `/rooms`
- `signup(formData)` → `signUp()` → return `{ success: true }` (hiện màn hình check email)
- `signout()` → `signOut()` → redirect `/login`
- `translateError(error)` → dịch tất cả Supabase error codes → tiếng Việt

---

## Supabase Client Setup

| File | Dùng khi |
|------|----------|
| `src/lib/supabase/client.ts` | Client Components (`"use client"`) |
| `src/lib/supabase/server.ts` | Server Components & Server Actions |
| `src/middleware.ts` | Middleware — refresh session cookie |

---

## Quyết định kỹ thuật quan trọng

1. **`@supabase/ssr`** thay vì `@supabase/auth-helpers-nextjs` — chuẩn mới cho Next.js 14 App Router
2. **Server Actions cho Auth** — không dùng API routes, giảm round-trip
3. **Optimistic Update** ở Gratitude: Thêm entry hiện ngay UI trước khi server confirm
4. **Migration Banner** thay vì auto-migrate — tôn trọng quyết định của user
5. **Profile** update cả Auth metadata và bảng `users` để đồng bộ display_name

---

## Dữ liệu mẫu đã seed

Bảng `contents` có **7 records** sẵn sàng:
- 2 affirmations → phòng `still`
- 2 quotes → phòng `recharge`
- 2 stories → phòng `mystery`
- 1 image placeholder → phòng `mystery`

---

## File đã tạo/sửa trong Giai đoạn 2

```
src/
├── app/
│   ├── login/
│   │   ├── page.tsx          [MODIFIED] 2-column layout
│   │   └── actions.ts        [MODIFIED] login/signup/signout + translateError
│   ├── register/
│   │   └── page.tsx          [NEW] Trang đăng ký
│   ├── profile/
│   │   └── page.tsx          [NEW] Trang hồ sơ cá nhân
│   └── page.tsx              [MODIFIED] Smart auth redirect
├── hooks/
│   ├── useUser.ts            [NEW]
│   ├── useGratitude.ts       [NEW]
│   └── useMoodSession.ts     [NEW]
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx        [MODIFIED] Avatar + user dropdown + logout
│   │   └── Sidebar.tsx       [MODIFIED] Mood → Supabase
│   └── rooms/
│       └── FeelRoom.tsx      [MODIFIED] Gratitude → Supabase + migration
├── lib/supabase/
│   ├── client.ts             [NEW] Browser client
│   └── server.ts             [NEW] Server client
├── middleware.ts              [NEW] Route protection
└── types/
    └── database.types.ts     [NEW] Auto-generated TypeScript types
```

---

## Giai đoạn 3 nên làm gì tiếp

1. **Dynamic Content Loading**: Đọc `contents` table và hiển thị trong từng phòng (StillRoom, RechargeRoom, MysteryRoom)
2. **Admin Dashboard**: Trang quản lý contents (chỉ role = 'admin')
3. **User Group Filtering**: Lọc content theo `group_id` của user
4. **Mood Analytics**: Biểu đồ tâm trạng theo tuần/tháng
5. **Vercel Deploy**: Thêm GitHub remote + deploy lên Vercel

---

## Checklist build

| Hạng mục | Kết quả |
|----------|---------|
| `npm run build` | ✅ Exit code 0 |
| TypeScript errors | ✅ 0 errors |
| ESLint warnings | ✅ 0 warnings |
| `console.log` trong source | ✅ Không có |
| Hardcoded credentials | ✅ Không có |
| `.env.local` trong git | ✅ Không track |
| RLS bảo vệ tất cả bảng | ✅ 8/8 bảng |
