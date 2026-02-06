// This is a template API proxy route for connecting to your FastAPI backend
// Uncomment and customize as needed for your deployment

/*
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const path = request.nextUrl.searchParams.get('path') || ''

    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const path = request.nextUrl.searchParams.get('path') || ''

    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/

export async function GET() {
  return new Response('API proxy template - see file for setup instructions', { status: 200 })
}
