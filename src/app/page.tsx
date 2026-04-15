import { redirect } from "next/navigation";

/**
 * Trang chủ — tự động chuyển hướng đến /rooms
 */
export default function HomePage() {
  redirect("/rooms");
}
