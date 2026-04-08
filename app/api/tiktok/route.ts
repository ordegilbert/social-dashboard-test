import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'No username' }, { status: 400 })
  }

  try {
    const userRes = await fetch(
      `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${username}`,
      {
        headers: {
          'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!
        }
      }
    )

    const userData = await userRes.json()
    console.log("TT USER:", userData);

    const user = userData.userInfo?.user
    const secUid = user?.secUid

    if (!secUid) {
      throw new Error('No secUid found')
    }

    const postsRes = await fetch(
      `https://tiktok-api23.p.rapidapi.com/api/user/posts?secUid=${secUid}&count=5&cursor=0`,
      {
        headers: {
          'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!
        }
      }
    )

    const postsData = await postsRes.json()

    console.log("TT POSTS:", postsData);

    const videos = postsData.data.itemList.slice(0, 5) || []

    const items = videos.map((v: any) => ({
      title: v.desc?.slice(0, 60) || 'TikTok Video',
      views: v.statsV2?.playCount || 0,
      thumbnail: v.video?.cover,
      link: `https://www.tiktok.com/@${username}/video/${v.id}`
    }))

    return NextResponse.json({
      profile: {
        name: user.nickname,
        avatar: user.avatarLarger
      },
      items,
      totalViews: userData.userInfo.statsV2?.followerCount || 0
    })
  } catch (err) {
    console.error('TT ERROR:', err)

    return NextResponse.json({
      profile: {
        name: username,
        avatar: 'https://via.placeholder.com/100'
      },
      totalViews: 0,
      items: []
    })
  }
}