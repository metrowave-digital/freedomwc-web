// app/api/enrollment/route.ts
import { hasRoleAtLeast } from '../../access/roles'

export async function GET(req: any) {
  if (!hasRoleAtLeast(req, 'student')) {
    return new Response('Forbidden', { status: 403 })
  }

  // return enrollment data
}
