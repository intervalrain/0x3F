import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const homePagePath = path.join(process.cwd(), 'HomePage.md');
    const content = fs.readFileSync(homePagePath, 'utf8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { content: '# Welcome\n\nWelcome to 0x3F LeetCode Tracker!' },
      { status: 200 }
    );
  }
}
