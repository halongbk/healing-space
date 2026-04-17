import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Dùng getUser() — xác minh với Supabase server (an toàn nhất)
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Các route cần đăng nhập
  const protectedRoutes = ['/rooms', '/dashboard', '/profile', '/admin']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  const isAdminRoute = pathname.startsWith('/admin')
  const isForbiddenRoute = pathname.startsWith('/admin/forbidden')

  // Chưa đăng nhập → redirect /login
  if (!user && isProtected && !isForbiddenRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Xử lý riêng cho /admin (bảo vệ quyền truy cập Admin)
  if (user && isAdminRoute && !isForbiddenRoute) {
    // Query user role. Middleware chạy ở Edge runtime nên select nhanh 1 column
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      // Redirect sang trang báo lỗi 403
      const forbiddenUrl = request.nextUrl.clone()
      forbiddenUrl.pathname = '/admin/forbidden'
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  // Đã đăng nhập → không vào /login hoặc /register nữa
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const roomsUrl = request.nextUrl.clone()
    roomsUrl.pathname = '/rooms'
    return NextResponse.redirect(roomsUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match tất cả request path, NGOẠI TRỪ:
     * - _next/static, _next/image
     * - favicon.ico
     * - sounds/ (file âm thanh)
     * - Hình ảnh tĩnh (.svg, .png, .jpg...)
     */
    '/((?!_next/static|_next/image|favicon.ico|sounds|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
