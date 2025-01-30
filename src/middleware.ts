import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
    '/dashboard', 
    '/dashboard/settings',
    '/api/scan',
    '/api/scan/today',
    '/api/scan/history',
]

const adminRoutes = [
    '/dashboard/users',
    '/dashboard/historic',
    '/api/users'
]

const authRoutes = ['/login', '/register']

async function verifyAuth(request: NextRequest) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
            headers: {
                'Cookie': request.headers.get('cookie') || ''
            }
        });
        
        const session = await response.json();
        return {
            isAuthenticated: response.ok && session.isValid,
            isAdmin: session?.user?.role === 'admin'
        };
    } catch (error) {
        console.error('Erreur de vérification de l\'authentification:', error);
        return {
            isAuthenticated: false,
            isAdmin: false
        };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const { isAuthenticated, isAdmin } = await verifyAuth(request)

    // Vérification des routes admin
    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Vérification des routes protégées
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirection des routes d'authentification si déjà connecté
    if (authRoutes.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirection de la page d'accueil
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
        '/api/scan/:path*',
        '/api/users/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
} 