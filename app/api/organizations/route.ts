import { getOrganization } from "@/server/organization"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { organizations } = await getOrganization()
    return NextResponse.json({ organizations })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}
