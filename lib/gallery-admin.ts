import { currentUser } from '@clerk/nextjs/server';
import { serverError } from '@/lib/server-error';

export async function getGalleryAdmin() {
  const user = await currentUser();
  if (!user) return { status: 401 } as const;
  if (user.publicMetadata.role !== 'admin') return { status: 403 } as const;

  return { status: 200, name: user.firstName || user.username } as const;
}

export function withGalleryAdmin(operation: string, handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      const access = await getGalleryAdmin();
      if (access.status !== 200) {
        const error = access.status === 401 ? 'Sign in required' : 'Administrator access required';
        return Response.json({ success: false, error }, { status: access.status });
      }
      return await handler(request);
    } catch (error) {
      return serverError(operation, error);
    }
  };
}
