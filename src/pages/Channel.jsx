import { useEffect, useState , useRef} from "react";
import { useParams, Link } from "react-router-dom";
import { api, getErrorMessage } from "../api/axiosClient";
import { getUserTweetsRequest } from "../api/tweet.api";
import { formatCount, timeAgo } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import SubscribeButton from "../components/SubscribeButton";
import Spinner from "../components/Spinner";
import TallyDot from "../components/TallyDot";
import {
  updateUserAvatar,
  updateUserCoverImage,
} from "../api/auth.api";
import { getChannelProfileRequest } from "../api/auth.api";


const TABS = ["Videos", "Tweets"];

export default function Channel() {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("Videos");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState("");
  const [subCount, setSubCount] = useState(0);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [updatingCover, setUpdatingCover] = useState(false);  // Fetch channel profile
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

      getChannelProfileRequest(username)
      .then((res) => {
        if (!active) return;
        const ch = res.data.data;
        setChannel(ch);
        setSubCount(ch.subscribersCount ?? 0);
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [username]);

  // Fetch videos when channel is loaded
  useEffect(() => {
    if (!channel?._id) return;
    setContentLoading(true);
    api
      .get("/videos", { params: { userId: channel._id, limit: 24 } })
      .then((res) => {
        const d = res.data.data;
        setVideos(d?.docs ?? d ?? []);
      })
      .finally(() => setContentLoading(false));
  }, [channel?._id]);

  // Fetch tweets on tab switch
  useEffect(() => {
    if (activeTab !== "Tweets" || !channel?._id) return;
    setContentLoading(true);
    getUserTweetsRequest(channel._id)
      .then((res) => {
        const d = res.data.data;
        setTweets(Array.isArray(d) ? d : d?.tweets ?? d?.docs ?? []);
      })
      .finally(() => setContentLoading(false));
  }, [activeTab, channel?._id]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    try {
      setUpdatingAvatar(true);
      setError("");
  
      const formData = new FormData();
      formData.append("avatar", file);
  
      const res = await updateUserAvatar(formData);
  
      const updatedUser = res.data.data;
  
      setChannel((prev) => ({
        ...prev,
        avatar: updatedUser.avatar,
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingAvatar(false);
      e.target.value = "";
    }
  };
  
  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    try {
      setUpdatingCover(true);
      setError("");
  
      const formData = new FormData();
      formData.append("coverImage", file);
  
      const res = await updateUserCoverImage(formData);
  
      const updatedUser = res.data.data;
  
      setChannel((prev) => ({
        ...prev,
        coverImage: updatedUser.coverImage,
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingCover(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink">{error || "Channel not found."}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-accent hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const isOwn = user?.username === channel.username;

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* ─── Cover image ─── */}
      <div className="relative h-36 w-full overflow-hidden rounded-b-2xl bg-surface md:h-52">
  {channel.coverImage ? (
    <img
      src={channel.coverImage}
      alt="Cover"
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-surface to-bg" />
  )}

  {isOwn && (
    <>
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverChange}
      />

      <button
        type="button"
        onClick={() => coverInputRef.current?.click()}
        disabled={updatingCover}
        className="absolute bottom-3 right-3 rounded-xl bg-bg/80 px-3 py-2 text-xs font-medium text-ink backdrop-blur hover:bg-bg disabled:opacity-50"
      >
        {updatingCover ? "Updating..." : "Edit cover"}
      </button>
    </>
  )}
</div>

      {/* ─── Channel meta ─── */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-line">
        <div className="flex items-end gap-4">
        <div className="relative">
  <img
    src={channel.avatar}
    alt={channel.username}
    className="-mt-12 h-20 w-20 rounded-full border-4 border-bg object-cover"
  />

  {isOwn && (
    <>
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <button
        type="button"
        onClick={() => avatarInputRef.current?.click()}
        disabled={updatingAvatar}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-bg/90 px-2 py-1 text-[10px] font-medium text-ink shadow hover:bg-bg disabled:opacity-50"
      >
        {updatingAvatar ? "..." : "Edit"}
      </button>
    </>
  )}
</div>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">
              {channel.fullName}
            </h1>
            <p className="font-mono text-xs text-muted">@{channel.username}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              <span className="text-ink">{formatCount(subCount)}</span> subscribers ·{" "}
              <span className="text-ink">
                {formatCount(channel.channelsSubscribedToCount)}
              </span>{" "}
              subscribed
            </p>
          </div>
        </div>

        {!isOwn && (
          <SubscribeButton
            channelId={channel._id}
            initialSubbed={channel.isSubscribed}
            initialCount={subCount}
            onCountChange={setSubCount}
          />
        )}
        {isOwn && (
          <Link
            to="/dashboard"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-accent hover:text-ink"
          >
            Creator Studio
          </Link>
          
        )}
      </div>

      {/* ─── Tabs ─── */}
      <div className="mt-4 flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-accent text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab content ─── */}
      <div className="py-6">
        {contentLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "Videos" ? (
          videos.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              No videos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          )
        ) : tweets.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">
            No broadcasts yet.
          </p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-3">
            {tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {channel.username}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {timeAgo(tweet.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink/90">
                      {tweet.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
