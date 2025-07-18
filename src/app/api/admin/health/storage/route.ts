/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID;
const NEON_API_KEY = process.env.NEON_API_KEY;

export async function GET() {
  if (!NEON_PROJECT_ID || !NEON_API_KEY) {
    console.error('Missing NEON_PROJECT_ID or NEON_API_KEY', { NEON_PROJECT_ID, NEON_API_KEY });
    return NextResponse.json({ error: 'Neon API credentials not set' }, { status: 500 });
  }

  try {
    // Neon does not provide direct storage usage API.
    // As a workaround, you can fetch branch details and estimate storage from size_bytes.
    // See: https://api-docs.neon.tech/reference/getprojectbranches

    const url = `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches`;
    console.log('Fetching Neon branches info from:', url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Neon API response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Neon API error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch Neon branch info', details: errorText }, { status: 500 });
    }

    const data = await res.json();
    // Aggregate size_bytes from all branches
    const branches = data.branches || [];
    // Debug: Log branches to check if size_bytes is present
    console.log('Neon branches:', branches);

    // If totalBytes is 0, likely size_bytes is missing or branches are empty
    const totalBytes = branches.reduce((sum: number, branch: any) => {
      // Neon may not populate size_bytes immediately for new branches
      // Try logging branch object for troubleshooting
      console.log('Branch:', branch);
      return sum + (branch.size_bytes || 0);
    }, 0);

    // Neon does not provide a storage limit in the API, so you may want to set your own limit
    const limitBytes = 10 * 1024 * 1024 * 1024; // Example: 10 GB

    const percentUsed = limitBytes > 0 ? Math.round((totalBytes / limitBytes) * 100) : 0;

    return NextResponse.json({ percentUsed, totalBytes, limitBytes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Neon branch info:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
