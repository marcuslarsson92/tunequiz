// app/api/users/save/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { name, email, artists } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await User.findOneAndUpdate(
    { email },
    { name, email, $addToSet: { artists: { $each: artists || [] } } },
    { new: true, upsert: true }
  );

  console.log('User created: ', user);

  return NextResponse.json(user);
}
