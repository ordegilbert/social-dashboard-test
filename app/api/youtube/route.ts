import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query =
    req.nextUrl.searchParams.get('username') ||
    req.nextUrl.searchParams.get('channel')

  if (!query) {
    return NextResponse.json({ error: 'No input' }, { status: 400 })
  }

  const clean = query.replace('@', '').trim()

  try {
    let channelId = clean

    if (!clean.startsWith('UC')) {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${clean}&key=${process.env.YOUTUBE_API_KEY}`
      )

      const searchData = await searchRes.json()

      const channel = searchData.items?.[0]
      channelId = channel?.snippet?.channelId

      if (!channelId) {
        throw new Error('Channel not found')
      }
    }

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`
    )

    const videoData = await videoRes.json()

    const videoIds = videoData.items
      .map((v: any) => v.id.videoId)
      .join(',')

    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
    )

    const statsData = await statsRes.json()

    const statsMap: Record<string, any> = {}

    statsData.items.forEach((s: any) => {
      statsMap[s.id] = s.statistics
    })

    const items = videoData.items.map((v: any) => {
      const stats = statsMap[v.id.videoId]

      return {
        title: v.snippet.title,
        views: Number(stats?.viewCount || 0),
        thumbnail: v.snippet.thumbnails.medium.url,
        link: `https://www.youtube.com/watch?v=${v.id.videoId}`
      }
    })

    const totalViews = items.reduce(
      (acc: number, i: any) => acc + i.views,
      0
    )

    const first = videoData.items[0]

    const profile = {
      name: first?.snippet?.channelTitle || clean,
      avatar:
        first?.snippet?.thumbnails?.default?.url ||
        'https://via.placeholder.com/100'
    }

    return NextResponse.json({
      profile,
      items,
      totalViews
    })
  } catch (err) {
    console.error('YT ERROR:', err)

    return NextResponse.json({
      profile: {
        name: clean,
        avatar: 'https://via.placeholder.com/100'
      },
      items: [],
      totalViews: 0
    })
  }
}