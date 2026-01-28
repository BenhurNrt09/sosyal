import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@repo/lib/src/middleware'

export async function middleware(request: NextRequest) {
    const isAdminAuth = request.cookies.get('admin_auth')?.value === 'true';
    const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboardPath && !isAdminAuth) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
