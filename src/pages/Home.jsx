import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVideosRequest } from "../api/video.api";
import { getErrorMessage } from "../api/axiosClient";
import VideoCard from "../components/VideoCard";
import TallyDot from "../components/TallyDot";

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getAllVideosRequest({ page: 1, limit: 12, query: query || undefined })
      .then((res) => {
        if (!active) return;
        const data = res.data.data;
        setVideos(data.docs || []);
        setPage(1);
        setHasNextPage(Boolean(data.hasNextPage));
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [query]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const res = await getAllVideosRequest({
        page: nextPage,
        limit: 12,
        query: query || undefined,
      });
      const data = res.data.data;
      setVideos((prev) => [...prev, ...(data.docs || [])]);
      setPage(nextPage);
      setHasNextPage(Boolean(data.hasNextPage));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {query && (
        <p className="mb-4 font-mono text-xs text-muted">
          RESULTS FOR “{query}”
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-20 justify-center font-mono text-sm text-muted">
          <TallyDot />
          LOADING FEED…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-ink">No broadcasts found.</p>
          <p className="mt-1 text-sm text-muted">
            {query
              ? "Try a different search."
              : "Be the first to upload something."}
          </p>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                className="rounded-full border border-line px-5 py-2 text-sm text-ink hover:border-accent hover:text-accent"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
