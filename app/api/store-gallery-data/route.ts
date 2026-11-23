function removed() {
  return Response.json({ success: false, error: 'Gallery seeding and bulk clearing have been removed.' }, { status: 410 });
}

export const GET = removed;
export const POST = removed;
export const DELETE = removed;
