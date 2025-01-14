import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = async (
  req: Request,
  { params }: { params: Promise<Record<string, unknown>> }
) => {
  const authParams = await params;
  return handleAuth()(req, { params: authParams });
};
