import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieOptions = {
  name: string
  value: string
  options?: Record<string, unknown>
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieOptions[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection based on user role
  const pathname = request.nextUrl.pathname

  // Protected routes
  const superadminRoutes = ['/superadmin']
  const adminRoutes = ['/admin']
  const deliveryRoutes = ['/delivery']
  const userProtectedRoutes = ['/orders', '/profile', '/checkout']

  // Check if route requires authentication
  const isProtectedRoute =
    superadminRoutes.some((route) => pathname.startsWith(route)) ||
    adminRoutes.some((route) => pathname.startsWith(route)) ||
    deliveryRoutes.some((route) => pathname.startsWith(route)) ||
    userProtectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Superadmin routes
    if (
      superadminRoutes.some((route) => pathname.startsWith(route)) &&
      role !== 'superadmin'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    // Admin routes
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      role !== 'admin' &&
      role !== 'superadmin'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    // Delivery routes
    if (
      deliveryRoutes.some((route) => pathname.startsWith(route)) &&
      role !== 'delivery' &&
      role !== 'superadmin'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
