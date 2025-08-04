// app/api/users/topArtists/route.ts
import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const session =  await getServerSession(authOptions);

        if (!session?.user?.email) {
          return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
    
        await dbConnect();

        const user = await User.findOne({ email: session.user.email }) as IUser | null;

        const topArtists = user?.artists?.sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(a => a.name) ?? [];

        return NextResponse.json({ topArtists });
  
}