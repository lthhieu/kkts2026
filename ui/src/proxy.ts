import { auth } from '@/auth';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const { nextUrl } = request;
    // Lấy session trực tiếp từ hàm auth(), cách này đáng tin cậy hơn là chỉ check cookie
    const session = await auth();
    const isAuthenticated = !!session?.access_token;

    // 1. Các trang yêu cầu đăng nhập (private routes)
    const isProtectedRoute = nextUrl.pathname.startsWith('/quan-tri');

    // Nếu truy cập trang private mà chưa đăng nhập -> redirect về trang đăng nhập
    if (isProtectedRoute && !isAuthenticated) {
        // Thêm `?callbackUrl=` để sau khi đăng nhập thành công, user được trả về đúng trang họ muốn
        const callbackUrl = nextUrl.pathname + nextUrl.search;
        return NextResponse.redirect(new URL(`/dang-nhap?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url));
    }

    // 2. Các trang công khai nhưng người đã đăng nhập không nên vào (public-only routes)
    const isPublicOnlyRoute = nextUrl.pathname === '/dang-nhap';

    // Nếu đã đăng nhập mà cố vào trang đăng nhập-> redirect về trang chủ quản trị
    if (isPublicOnlyRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/quan-tri/trang-chu', request.url));
    }

    // Nếu không thuộc các trường hợp trên, cho phép đi tiếp
    return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: ['/quan-tri/:path*', '/dang-nhap'],
};