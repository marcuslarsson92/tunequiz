// app/api/users/updateArtist/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const { email, artists } = await req.json(); // artists = ["Adele", "Beyoncé", ...]
  if (!email || !Array.isArray(artists)) {
    return NextResponse.json({ error: 'Bad input' }, { status: 400 });
  }

  await dbConnect();

  // Get or create the user
  const user = await User.findOneAndUpdate(
    { email },
    {},
    { upsert: true, new: true }
  );

  // Increment count if artist exist or add new
  artists.forEach((artistName: string) => {
    // Does the artist already exist?
    const found = user.artists.find((a: any) => a.name === artistName);
    if (found) {
      console.log(`Inside forEach in updateArtists. \n
        found artists is: `, found);
      found.count += 1;   
    } else {
      user.artists.push({ name: artistName, count: 1 });
    }
  });

  // Sort the count, highest first and slice at 5 to get top5
  user.artists.sort((a: any, b: any) => b.count - a.count);
  user.artists = user.artists.slice(0, 5);

  await user.save();
  return NextResponse.json(user);
}
