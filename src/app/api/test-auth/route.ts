import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    console.log('Session:', session);
    console.log('User ID:', session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          session: session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: 'Authenticated',
      userId: session.user.id,
      userEmail: session.user.email,
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 },
    );
  }
}
