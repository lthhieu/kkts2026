import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    if (!request.cookies.get('authjs.session-token')) {
        return NextResponse.redirect(new URL('/dang-nhap', request.url))
    }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: '/quan-tri/:path*',
}