#  Social Media Dashboard

A web application built with **Next.js** to display and compare engagement metrics (views) from multiple social media platforms in a single dashboard.

---

##  Live Demo

>  [https://your-deployment-url.vercel.app](https://social-dashboard-test.vercel.app)

---

##  Features

### 🔹 Multi-Platform Integration

Supports data fetching from:

* **YouTube**
* **Instagram**
* **TikTok**

---

### 🔹 Dynamic Input

Users can input:

* YouTube **username / handle / channel ID**
* Instagram **username**
* TikTok **username**

---

### 🔹 Data Display (per platform)

Each platform displays:

*  Profile name
*  Profile picture
*  Total views (aggregated from latest content)
*  Latest 5 contents:

  * Title
  * View count
  * Thumbnail
  * Clickable link to original content

---

### 🔹 Real-Time Data Fetching

* Data updates dynamically based on input
* No page reload required
* Independent loading state per platform

---

### 🔹 Optimized API Calls

*  **Debounced input (500ms)** to prevent excessive requests
*  Minimum input length validation
*  Conditional fetching using SWR keys

---

### 🔹 UI / UX

* Clean and responsive layout (3-column dashboard)
* Skeleton loading state (no layout shift)
* Error handling per platform
* Stable layout (no jumping elements)

---

##  Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Data Fetching:** SWR
* **Styling:** Tailwind CSS
* **APIs:**

  * YouTube Data API v3
  * RapidAPI (Instagram & TikTok)

---

##  Technical Approach

### 1. YouTube Integration

* Converts username → `channelId` using search endpoint
* Fetches latest videos
* Retrieves **view count via videos endpoint** (separate API call)

>  Note: YouTube API does not provide view count in the search endpoint, so an additional request is required.

---

### 2. Instagram Integration

* Uses RapidAPI endpoint for:

  * Profile data
  * Posts data
* Combines both responses into a unified structure
* Uses likes as fallback metric for views

---

### 3. TikTok Integration

* Resolves `secUid` from username
* Fetches posts using `secUid`
* Extracts:

  * Views (`stats.playCount`)
  * Thumbnail (`video.cover`)
  * Profile data from post author

>  Note: TikTok API response structure varies, so flexible mapping is implemented.

---

### 4. Unified Data Structure

All platforms are normalized into:

```ts
{
  profile: {
    name: string
    avatar: string
  },
  items: [
    {
      title: string
      views: number
      thumbnail: string
      link: string
    }
  ],
  totalViews: number
}
```

---

### 5. Performance Optimization

* Debouncing prevents unnecessary API calls while typing
* SWR ensures efficient caching and revalidation
* Conditional fetching avoids invalid requests

---

##  Challenges & Solutions

###  API Limitations

* YouTube requires multiple API calls → solved via chaining requests
* TikTok requires `secUid` → resolved via additional user lookup
* Instagram unofficial endpoints may fail → handled with fallback & error states

---

###  Inconsistent API Responses

* TikTok & Instagram responses vary → handled using flexible field mapping

---

###  Image Rendering Issues

* Some external images blocked → fallback image handling implemented

---

##  How to Run Locally

```bash
git clone https://github.com/your-username/social-dashboard
cd social-dashboard
npm install
npm run dev
```

---

##  Environment Variables

Create `.env.local`:

```env
YOUTUBE_API_KEY=your_youtube_api_key
RAPIDAPI_KEY=your_rapidapi_key
```

---

##  Key Takeaways

* Efficient API handling across multiple platforms
* Real-world handling of inconsistent third-party APIs
* Performance optimization using debouncing & SWR
* Clean and scalable frontend architecture

---
