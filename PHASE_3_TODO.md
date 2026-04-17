# GIAI ĐOẠN 3 — TỔNG QUAN

**Mục tiêu:** Admin quản lý được nội dung, cơ chế "túi mù" (Mystery Box) hoạt động với weighted random theo mood + group user.

## Các Yêu Cầu Phát Triển Dành Cho Agent/Coder Kế Tiếp

Giai đoạn 3 gồm 5 bước cụ thể. Bạn vui lòng đọc kỹ từng bước và thực hiện code tuần tự (không thực hiện tất cả trong 1 lượt để tránh quá tải).

---

### Bước 9: Admin Layout & Bảo vệ route
**Nhiệm vụ:**
- Tạo một thư mục `src/app/admin/layout.tsx` và cấu trúc giao diện riêng biệt (Menu bên trái, phần nội dung thao tác bên phải).
- Mở file `src/middleware.ts` và thêm logic kiểm tra: Những routes bắt đầu bằng `/admin` chỉ được truy cập nếu `user.user_metadata.role === 'admin'`. Nếu không phải admin, trả về trang `/rooms` hoặc `/login` kèm thông báo báo lỗi (bằng query URL).

**Kết quả mong đợi:** Admin có khung giao diện làm việc riêng biệt và bảo mật hoàn toàn khỏi user bình thường.

---

### Bước 10: Admin CMS — Quản lý nội dung
**Nhiệm vụ:** 
- Xây dựng trang danh sách nội dung `src/app/admin/contents/page.tsx` lấy dữ liệu từ bảng `contents`.
- Tạo một form thêm/sửa/xóa nội dung (có các trường: `title`, `content_type`, `body`, `target_mood`, v.v.).
- *(Option)*: Tích hợp Supabase Storage upload ảnh nếu `content_type` là `image`.

**Kết quả mong đợi:** Admin có thể tạo sửa xóa thẻ affirmation, quote, hình ảnh, bài viết ngay trên Giao diện web.

---

### Bước 11: API Weighted Random (Cơ chế Túi Mù)
**Nhiệm vụ:**
- Xây dựng một logic API (Next.js route handler tại `src/app/api/mystery/route.ts` hoặc custom hooks fetching).
- Cơ chế lấy ngẫu nhiên có trọng số (Weighted Random) từ bảng `contents`:
  - Ưu tiên bốc ra các nội dung có `target_mood` khớp với `mood` gần nhất của user.
  - Loại trừ các nội dung mà user này đã tương tác/ấn "đã hiểu" hoặc "đã xem" (cân nhắc tracking lịch sử qua 1 bảng phụ nhỏ hoặc column trên `user_sessions`).
  - Hỗ trợ tuỳ chọn query theo `group_id` của user hiện tại.

**Kết quả mong đợi:** Hệ thống Backend trả ra một Object Content phù hợp với trạng thái tâm lý user.

---

### Bước 12: Component MysteryBox
**Nhiệm vụ:**
- Tạo Component UI cho Túi Mù/MysteryBox trong `src/components/rooms/MysteryRoom.tsx` (hoặc tách nhỏ `ui/MysteryBox.tsx`).
- Sử dụng Framer Motion làm animation:
  1. Hộp ban đầu đóng kín, to dần hoặc rung lắc.
  2. User nhấn/Click vào hộp 👉 Hộp mở bung nắp toả ánh sáng vàng/xanh.
  3. Lộ ra tấm thẻ thông điệp (Affirmation, Trích dẫn, hoặc câu chuyện ngẫu nhiên).
- Thiết kế tấm thẻ dạng Glassmorphism cao cấp, font chữ mượt mà.

**Kết quả mong đợi:** Có một trải nghiệm UI/Animation tuyệt vời để bốc "Túi Mù".

---

### Bước 13: Tích hợp & Kiểm tra tổng thể
**Nhiệm vụ:**
- Cắm ghép component **MysteryBox** vào room "Túi mù" hiện tại.
- Fetch dữ liệu bằng **API Weighted Random** mỗi khi user click mở hộp.
- Tạo một tài khoản Admin thực tế và chạy flow từ đầu chí cuối. 

**Kết quả mong đợi:** Tính năng túi mù hoạt động End-to-End trơn tru trong thực tế.


---
## Quy trình Handoff
Sau khi chạy xong mỗi bước trên, người chạy/Agent cần cập nhật tiến độ vào files lưu ký tiến trình (`memory/progress/state_handoff.md`).
