import { NextRequest, NextResponse } from "next/server";
import { platform } from "os";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "No username" }, { status: 400 });
  }

  try {
    const [profileRes, postsRes] = await Promise.all([
      fetch("https://instagram120.p.rapidapi.com/api/instagram/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "instagram120.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
        body: JSON.stringify({ username }),
      }),

      fetch("https://instagram120.p.rapidapi.com/api/instagram/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "instagram120.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
        body: JSON.stringify({ username }),
      }),
    ]);

    const profileData = await profileRes.json();
    const postsData = await postsRes.json();

    console.log("IG PROFILE:", profileData);
    console.log("IG POSTS:", postsData);

    const user = profileData.result;

    const edges = postsData.result?.edges?.slice(0, 5) || [];

    const items = edges.map((e: any) => {
      const node = e.node;

      const shortcode = node.code;

      const thumbnail =
        node.image_versions2?.candidates?.[0]?.url ||
        node.video_versions?.[0]?.url || 
        "https://via.placeholder.com/200";

      const title = node.caption?.text?.slice(0, 60) || "Instagram Post";

      return {
        title,
        views: node.like_count || 0, 
        thumbnail,
        link: `https://www.instagram.com/p/${shortcode}/`,
      };
    });

    return NextResponse.json({
      profile: {
        name: user.full_name || user.username,
        avatar: `/api/image-proxy?url=${encodeURIComponent(user.profile_pic_url)}`,
      },
      items,
      totalViews: user.edge_followed_by?.count || 0,
    });
  } catch (err) {
    console.error("IG ERROR:", err);

    return NextResponse.json({
      profile: {
        name: username,
        avatar: "https://via.placeholder.com/100",
      },
      totalViews: 0,
      items: [],
    });
  }
}
