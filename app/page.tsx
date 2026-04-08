"use client";

import { useState } from "react";
import useSWR from "swr";
import SocialCard from "./components/SocialCard";
import { useDebounce } from "./hooks/useDebounce";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Home() {
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");

  const debouncedYoutube = useDebounce(youtube, 500);
  const debouncedInstagram = useDebounce(instagram, 500);
  const debouncedTiktok = useDebounce(tiktok, 500);

  const ytKey =
    debouncedYoutube.length >= 3
      ? `/api/youtube?username=${debouncedYoutube}`
      : null;

  const igKey =
    debouncedInstagram.length >= 3
      ? `/api/instagram?username=${debouncedInstagram}`
      : null;

  const ttKey =
    debouncedTiktok.length >= 3
      ? `/api/tiktok?username=${debouncedTiktok}`
      : null;

  const {
    data: yt,
    isLoading: ytLoading,
    error: ytError,
  } = useSWR(ytKey, fetcher);

  const {
    data: ig,
    isLoading: igLoading,
    error: igError,
  } = useSWR(igKey, fetcher);

  const {
    data: tt,
    isLoading: ttLoading,
    error: ttError,
  } = useSWR(ttKey, fetcher);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl text-black font-bold">
            Social Media Dashboard
          </h1>
          <p className="text-gray-500">
            Track views across platforms
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 text-black">
          <input
            className="p-3 rounded-lg border focus:ring-2 focus:ring-red-500"
            placeholder="YouTube Username"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />

          <input
            className="p-3 rounded-lg border focus:ring-2 focus:ring-pink-500"
            placeholder="Instagram Username"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />

          <input
            className="p-3 rounded-lg border focus:ring-2 focus:ring-black"
            placeholder="TikTok Username"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* YOUTUBE */}
          <div>
            {ytLoading ? (
              <Skeleton />
            ) : ytError ? (
              <ErrorBox label="YouTube failed" />
            ) : yt ? (
              <SocialCard platform="YouTube" data={yt} />
            ) : null}
          </div>

          {/* INSTAGRAM */}
          <div>
            {igLoading ? (
              <Skeleton />
            ) : igError ? (
              <ErrorBox label="Instagram failed" />
            ) : ig ? (
              <SocialCard platform="Instagram" data={ig} />
            ) : null}
          </div>

          {/* TIKTOK */}
          <div>
            {ttLoading ? (
              <Skeleton />
            ) : ttError ? (
              <ErrorBox label="TikTok failed" />
            ) : tt ? (
              <SocialCard platform="TikTok" data={tt} />
            ) : null}
          </div>
        </div>

        {!yt && !ig && !tt && (
          <div className="text-center text-gray-400 mt-10">
            Enter at least one account to begin
          </div>
        )}
      </div>
    </main>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-2xl shadow space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
  );
}

function ErrorBox({ label }: { label: string }) {
  return (
    <div className="bg-red-100 text-red-600 p-4 rounded-xl text-center">
      {label}
    </div>
  );
}