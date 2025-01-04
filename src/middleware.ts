import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/dashboard/users', '/dashboard/settings']
const authRoutes = ['/login', '/register']

async function verifyAuth(request: NextRequest) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
            headers: {
                'Cookie': request.headers.get('cookie') || ''
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Erreur de vérification de l\'authentification:', error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Vérification de l'authentification
    const isAuthenticated = await verifyAuth(request)

    // Si l'utilisateur est sur une route protégée et n'est pas authentifié
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si l'utilisateur est sur une route d'authentification et est déjà authentifié
    if (authRoutes.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si l'utilisateur est sur la page d'accueil et n'est pas authentifié
    if (pathname === '/' && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
} 