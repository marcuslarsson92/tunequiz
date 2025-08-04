// app/api/users/save/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

type Artist = {
  name: string,
  count: number
};

export async function POST(req: Request) {
  await dbConnect();
  const { email, artists } = await req.json();
  

  if (!email || !Array.isArray(artists)) {
    return NextResponse.json({ error: 'Email is required, or bad input on artists' }, { status: 400 });
  }

  const user = await User.findOneAndUpdate(
    { email },
    {},
    { new: true, upsert: true }
  ) as IUser;

  artists.forEach((artistName: string) => {
    const existing = user.artists.find((a: Artist) => a.name === artistName);
    if (existing) {
      existing.count += 1;
    } else {
      user.artists.push({ name: artistName, count: 1});
    }
  });

  await user.save();

  console.log('User created: ', user);

  return NextResponse.json(user);
}
