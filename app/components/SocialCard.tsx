type Item = {
  id?: string;
  title: string;
  views: number;
  thumbnail: string;
  link?: string;
};

type Data = {
  profile: {
    name: string;
    avatar: string;
  };
  items: Item[];
  totalViews: number;
};

type Props = {
  platform: "YouTube" | "Instagram" | "TikTok";
  data: Data;
};

const platformStyle = {
  YouTube: {
    color: "bg-red-500",
    label: "YouTube",
  },
  Instagram: {
    color: "bg-pink-500",
    label: "Instagram",
  },
  TikTok: {
    color: "bg-black",
    label: "TikTok",
  },
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

export default function SocialCard({ platform, data }: Props) {
  const style = platformStyle[platform];

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4 text-black">
      <div className="flex items-center gap-4">
        <img
          src={data.profile.avatar}
          className="w-14 h-14 rounded-full border object-cover"
        />

        <div>
          <h2 className="font-semibold text-lg">{data.profile.name}</h2>

          <span
            className={`text-xs text-white px-2 py-1 rounded ${style.color}`}
          >
            {style.label}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-500">
          {platform === "YouTube" ? "Total Subscribers" : "Total Followers"}
        </p>
        <p className="text-xl font-bold">{formatNumber(data.totalViews)}</p>
      </div>

      <div className="space-y-3">
        {data.items?.map((item, i) => {
          let href = "#";

          if (item.link) {
            href = item.link;
          } else if (platform === "YouTube" && item.id) {
            href = `https://www.youtube.com/watch?v=${item.id}`;
          }

          return (
            <a
              key={i}
              href={href}
              target="_blank"
              className="flex gap-3 items-center hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <img
                src={item.thumbnail || "https://via.placeholder.com/200"}
                className="w-24 h-14 object-cover rounded-lg"
              />

              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-2">{item.title}</p>

                <p className="text-xs text-gray-500">
                  {formatNumber(item.views)}{" "}
                  {platform === "Instagram" ? "likes" : "views"}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
