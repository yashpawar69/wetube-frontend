import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Tweets from "./pages/Tweets";
import Channel from "./pages/Channel";
import LikedVideos from "./pages/LikedVideos";
import Settings from "./pages/Settings";
import WatchHistory from "./pages/WatchHistory";
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-ink font-body">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all routes require login (backend enforces this) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/watch/:videoId" element={<Layout><Watch /></Layout>} />
          <Route path="/upload" element={<Layout><Upload /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/tweets" element={<Layout><Tweets /></Layout>} />
          <Route path="/channel/:username" element={<Layout><Channel /></Layout>} />
          <Route path="/liked" element={<Layout><LikedVideos /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/history" element={<Layout><WatchHistory /></Layout>} />
        </Route>
      </Routes>
    </div>
  );
}
