# HEALING SPACE — HANDOFF Giai đoạn 3 → Giai đoạn 4
Ngày: 2026-04-24

## Repository
- **GitHub**: https://github.com/halongbk/healing-space
- **Branch chính**: `main`
- **Production (Vercel)**: https://healing-space-fawn.vercel.app
- **Auto deploy**: Mỗi lần push main → Vercel build tự động

---

## Tổng quan Giai đoạn 3

Giai đoạn 3 đã hoàn chỉnh toàn bộ **khu vực Admin + CMS + API nội dung thông minh + Mystery Box**. Dự án sẵn sàng cho Giai đoạn 4 (Analytics + Mobile optimization).

---

## Những gì đã xong trong Giai đoạn 3

### Admin Dashboard & CMS
- Route `/admin` — chỉ `role = 'admin'` mới vào được
- Middleware bảo vệ kiểm tra JWT `app_metadata.role`
- Dashboard hiển thị số liệu thật từ DB (tổng content, users, sessions, phòng phổ biến)
- **CRUD Contents** tại `/admin/contents`:
  - Danh sách có filter (loại, phòng, trạng thái), tìm kiếm, phân trang 20 dòng
  - Form thêm/sửa động theo loại content (story → textarea, image → upload, video/minigame → URL)
  - Upload ảnh lên Supabase Storage bucket `healing-content`
  - **Soft-delete**: nếu content có lịch sử trong `user_sessions` → chỉ set `is_active = false`

### Thuật toán API Weighted Random
- **Endpoint**: `GET /api/content/random?room=mystery&mood=buon`
- **5 bước lọc**: active → room → group_ids → mood_tags → chưa xem 7 ngày
- **Weighted selection**: Cumulative Probability O(n) — content có weight cao xuất hiện nhiều hơn
- **Fallback chain**: nếu lọc quá chặt → nới lỏng dần → không bao giờ trả tay trắng
- **Timeout 5s** + nút Thử lại cho mạng chậm

### Tracking Session
- **Endpoint**: `POST /api/sessions/track` — lưu xem content nào, phòng nào, mood gì
- Gọi tự động sau khi content được hiển thị (delay 500ms)
- Dữ liệu này cung cấp cho bộ lọc "chưa xem 7 ngày"

### Mystery Box Component
- 4 trạng thái animation mượt: IDLE → OPENING (shake+explode+particles) → LOADING (skeleton) → REVEALED
- Renderer đa loại: `story/affirmation/quote` (serif italic), `image` (lazy load), `video` (16:9 iframe), `minigame` (400px iframe)
- Prefetch khi hover vào nút Mystery ở Sidebar
- Badge "NEW" trên Sidebar

### Kết nối Mood → Content
- User chọn mood ở Sidebar → `onMoodChange` callback → `rooms/page.tsx` → `MysteryRoom` → `MysteryBox` → API param `?mood=`
- Content có `mood_tags` match xuất hiện nhiều hơn

### Phòng StillRoom & RechargeRoom
- Fetch affirmations/quotes từ Supabase DB (có fallback hardcode nếu DB rỗng)
- StillRoom: `contents WHERE type='affirmation' AND (room='still' OR room='all')`
- RechargeRoom: `contents WHERE type='quote' AND (room='recharge' OR room='all')`

### Bảo mật RLS — Đã fix
- **Lỗi đệ quy vô hạn**: policy `users` cũ tự tham chiếu lại chính nó
- **Fix**: Tạo `public.get_current_user_role()` với `SECURITY DEFINER` → bypass RLS cho phép đọc role an toàn
- Tất cả policies của `contents` và `user_sessions` dùng function này

---

## API Endpoints (Giai đoạn 3)

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/content/random` | GET | Trả 1 content theo weighted random |
| `/api/sessions/track` | POST | Lưu lịch sử xem content |

**Params cho `/api/content/random`**:
- `room` (bắt buộc): tên phòng
- `mood` (tuỳ chọn): cảm xúc để filter

**Body cho `/api/sessions/track`**:
```json
{ "room": "mystery", "mood": "lo lắng", "content_id": "uuid", "duration_seconds": 30 }
```

---

## Custom Hooks mới (Giai đoạn 3)

| Hook | File | Chức năng |
|------|------|-----------|
| `useRandomContent()` | `src/hooks/useRandomContent.ts` | Fetch content ngẫu nhiên, auto-track, refetch, timeout 5s + retry |

---

## Cấu trúc Storage

- **Bucket**: `healing-content` (public read)
- **RLS**: Admin upload/delete, public read
- **Giới hạn**: 5MB/file, chỉ nhận `image/*`
- **URL pattern**: `https://<project>.supabase.co/storage/v1/object/public/healing-content/<filename>`

---

## Database Functions

```sql
-- Kiểm tra role mà không gây đệ quy RLS
public.get_current_user_role() RETURNS text SECURITY DEFINER
```

---

## File mới/sửa trong Giai đoạn 3

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    [NEW] Admin dashboard số liệu thật
│   │   ├── layout.tsx                  [NEW] Admin layout + Sidebar
│   │   └── contents/
│   │       ├── page.tsx                [NEW] Danh sách contents + filter + paginate
│   │       ├── actions.ts              [NEW] Server Actions CRUD + upload
│   │       ├── new/page.tsx            [NEW] Trang thêm content mới
│   │       ├── [id]/edit/page.tsx      [NEW] Trang sửa content
│   │       └── _components/
│   │           ├── ContentsTable.tsx   [NEW] Bảng + filter + confirm xóa
│   │           └── ContentForm.tsx     [NEW] Form dynamic theo loại content
│   ├── api/
│   │   ├── content/random/route.ts     [NEW] API weighted random content
│   │   └── sessions/track/route.ts     [NEW] API lưu session
│   └── rooms/page.tsx                  [MODIFIED] mood state + pass to MysteryRoom
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                 [MODIFIED] badge NEW + prefetch + onMoodChange
│   │   └── Topbar.tsx                  [MODIFIED] role từ JWT app_metadata
│   └── rooms/
│       ├── MysteryBox.tsx              [NEW] Component 4 trạng thái animation
│       ├── MysteryRoom.tsx             [NEW] Background stars + mood prop
│       ├── StillRoom.tsx               [MODIFIED] Fetch affirmations từ DB
│       └── RechargeRoom.tsx            [MODIFIED] Fetch quotes từ DB
├── hooks/
│   └── useRandomContent.ts             [NEW] Hook fetch content + track + timeout
├── lib/
│   └── weighted-random.ts              [NEW] Thuật toán cumulative probability
└── middleware.ts                       [MODIFIED] Bảo vệ /admin bằng JWT role
```

---

## Quyết định kỹ thuật quan trọng

1. **SECURITY DEFINER function** thay vì query trực tiếp trong RLS policy → tránh đệ quy vô hạn
2. **JWT app_metadata.role** trong Middleware → không cần query DB, không bị RLS block
3. **Cumulative Probability** cho weighted random → O(n), hỗ trợ float weight tương lai
4. **Soft-delete** khi content có trong user_sessions → giữ toàn vẹn dữ liệu lịch sử
5. **Prefetch on hover** cho Mystery Box → animation mở gần như tức thì
6. **Fallback chain** trong content filter → không bao giờ hiện tay trắng

---

## Lưu ý cho Giai đoạn 4

1. **Đổi role user**: chỉ sửa trong bảng `public.users` → trigger sẽ tự sync lên JWT. User cần logout/login lại để JWT refresh
2. **Thêm content DB**: vào `/admin/contents/new` để thêm
3. **user_sessions** có thể grow nhanh — cân nhắc add index `(user_id, room, created_at)` nếu chậm
4. **MysteryBox key**: component dùng `key={displayContent.id}` để re-animate khi content thay đổi
5. **Mood filter**: so sánh case-insensitive trong app (JS `.toLowerCase()`), nhưng DB lưu có dấu hoa thường — nên chuẩn hóa data mood_tags về lowercase khi add content mới
6. Bucket `healing-content` đang ở chế độ **public** — đủ cho MVP, cân nhắc signed URLs nếu cần private content sau này

---

## Checklist build Giai đoạn 3

| Hạng mục | Kết quả |
|----------|---------| 
| `npm run build` | ✅ Exit code 0 |
| TypeScript errors | ✅ 0 errors |
| ESLint warnings | ✅ 0 warnings |
| API key lộ client-side | ✅ Không có |
| N+1 queries | ✅ Không có |
| RLS tất cả bảng | ✅ Đầy đủ |
| Infinite recursion RLS | ✅ Đã fix |

---

## Giai đoạn 4 nên làm gì

1. **Mood Analytics**: Biểu đồ tâm trạng theo tuần/tháng từ `user_sessions`
2. **Admin User Management**: Xem danh sách users, đổi role, xem thống kê
3. **Mobile PWA**: Thêm manifest + service worker để install như app native
4. **Content trong các phòng còn lại**: BreatheRoom, FeelRoom, CreateRoom nối với DB
5. **Notification system**: Nhắc nhở check-in cảm xúc hàng ngày
6. **Performance**: Lazy load các Room components nặng
