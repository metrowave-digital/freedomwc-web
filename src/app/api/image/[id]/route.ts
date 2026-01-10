// src/app/api/image/[id]/route.ts

import { NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  _req: Request,
  { params }: RouteParams,
) {
  const { id } = await params

  if (!id) {
    return new NextResponse('Missing image id', { status: 400 })
  }

  // ✅ CORRECT Payload media endpoint
  const imageUrl = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/media/file/${id}`

  try {
    const res = await fetch(imageUrl)

    if (!res.ok) {
      return new NextResponse('Image not found', {
        status: res.status,
      })
    }

    const contentType =
      res.headers.get('content-type') ?? 'application/octet-stream'

    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    return new NextResponse('Image fetch failed', { status: 500 })
  }
}
