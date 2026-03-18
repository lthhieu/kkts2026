import { auth } from '@/auth';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ✅ DEFAULT EXPORT BẮT BUỘC
export default async function proxy(request: NextRequest) {
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;

    // ✅ Bước 1: Bỏ qua tất cả các request API Auth để tránh chặn session
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Lấy session
    const session = await auth();

    // Kiểm tra trạng thái xác thực (Đảm bảo session tồn tại và có access_token)
    const isAuthenticated = !!session?.access_token;

    // Xử lý lỗi refresh token nếu có
    const isErrorSession = session?.error === "RefreshAccessTokenError";

    // 1. Các trang yêu cầu đăng nhập
    const isProtectedRoute = pathname.startsWith('/quan-tri');

    // Nếu truy cập trang private mà chưa đăng nhập HOẶC session bị lỗi -> Redirect về đăng nhập
    if (isProtectedRoute && (!isAuthenticated || isErrorSession)) {
        // Xóa cookie session cũ để tránh loop khi quay lại đăng nhập
        const response = NextResponse.redirect(new URL(`/dang-nhap?callbackUrl=${encodeURIComponent(pathname)}`, request.url));

        // Xóa sạch cookie AuthJS
        response.cookies.delete('authjs.session-token');
        response.cookies.delete('__Secure-authjs.session-token');

        return response;
    }

    // 2. Các trang công khai nhưng người đã đăng nhập không nên vào
    const isPublicOnlyRoute = pathname === '/dang-nhap';

    // Nếu đã đăng nhập mà cố vào trang đăng nhập -> Redirect về trang chủ quản trị
    if (isPublicOnlyRoute && isAuthenticated && !isErrorSession) {
        return NextResponse.redirect(new URL('/quan-tri/trang-chu', request.url));
    }

    // Nếu không thuộc các trường hợp trên, cho phép đi tiếp
    return NextResponse.next();
}

// ✅ Config Matcher cần bao gồm tất cả trừ các resource tĩnh
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};