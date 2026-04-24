"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRandomContent, ContentItem } from "@/hooks/useRandomContent";
import { Sparkles } from "lucide-react";

// ─── Content Renderer ────────────────────────────────────────────────────────
function StoryCard({ content }: { content: ContentItem }) {
  return (
    <div className="text-center space-y-6 max-w-lg mx-auto">
      {/* Dấu ngoặc trang trí */}
      <p className="text-6xl text-white/20 font-serif leading-none select-none">&ldquo;</p>
      <p className="text-white/95 text-xl md:text-2xl font-serif italic leading-relaxed px-2">
        {content.body || content.title}
      </p>
      <p className="text-6xl text-white/20 font-serif leading-none select-none rotate-180">&ldquo;</p>
      <p className="text-white/50 text-sm tracking-widest uppercase">{content.title}</p>
    </div>
  );
}

function ImageCard({ content }: { content: ContentItem }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-white/10 aspect-video">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-white/10" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.media_url || ""}
          alt={content.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>
      <p className="text-white/80 text-center text-sm">{content.title}</p>
    </div>
  );
}

function VideoCard({ content }: { content: ContentItem }) {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <p className="text-white/80 text-center text-sm font-medium">{content.title}</p>
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={content.media_url || ""}
          title={content.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function MinigameCard({ content }: { content: ContentItem }) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      <p className="text-white/80 text-center text-sm font-medium">{content.title}</p>
      <div className="relative w-full rounded-2xl overflow-hidden h-[400px]">
        <iframe
          src={content.media_url || ""}
          title={content.title}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function ContentRenderer({ content }: { content: ContentItem }) {
  if (content.type === "image") return <ImageCard content={content} />;
  if (content.type === "video") return <VideoCard content={content} />;
  if (content.type === "minigame") return <MinigameCard content={content} />;
  // story / affirmation / quote
  return <StoryCard content={content} />;
}

// ─── Particle ─────────────────────────────────────────────────────────────────
function Particle({ delay }: { delay: number }) {
  const angle = Math.random() * 360;
  const dist = 60 + Math.random() * 100;
  const x = Math.cos((angle * Math.PI) / 180) * dist;
  const y = Math.sin((angle * Math.PI) / 180) * dist;
  const colors = ["#C9B8F0", "#F0C8E0", "#B8D8F0", "#F0E8B8", "#B8F0C8"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 4 + Math.random() * 6;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y: y - 30, opacity: 0, scale: 0 }}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, marginLeft: -size / 2, marginTop: -size / 2 }}
    />
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ContentSkeleton() {
  return (
    <div className="space-y-4 text-center max-w-sm mx-auto">
      <div className="h-4 bg-white/10 rounded-full animate-pulse w-3/4 mx-auto" />
      <div className="h-4 bg-white/10 rounded-full animate-pulse w-full mx-auto" />
      <div className="h-4 bg-white/10 rounded-full animate-pulse w-5/6 mx-auto" />
      <div className="h-4 bg-white/10 rounded-full animate-pulse w-2/3 mx-auto" />
    </div>
  );
}

// ─── Main MysteryBox ──────────────────────────────────────────────────────────
type BoxState = "idle" | "opening" | "loading" | "revealed";

interface MysteryBoxProps {
  mood?: string;
  prefetchedContent?: ContentItem | null;
}

export default function MysteryBox({ mood, prefetchedContent }: MysteryBoxProps) {
  const [boxState, setBoxState] = useState<BoxState>("idle");
  const [showParticles, setShowParticles] = useState(false);
  const particleCount = 16;
  const hasTriggeredRef = useRef(false);

  const { content, isLoading, fetch: fetchContent, refetch } = useRandomContent({
    room: "mystery",
    mood,
    autoTrack: true,
  });

  // Nếu có prefetch content → dùng ngay
  const displayContent = content || prefetchedContent || null;

  const handleOpen = async () => {
    if (boxState === "opening") return;
    hasTriggeredRef.current = false;
    setBoxState("opening");
    setShowParticles(true);

    // Bắt đầu fetch song song với animation
    fetchContent();

    // Sau 1.2s animation mở hộp xong
    setTimeout(() => {
      setShowParticles(false);
      setBoxState("loading");
    }, 1200);
  };

  // Khi fetch xong và đang ở loading → chuyển sang revealed
  useEffect(() => {
    if (boxState === "loading" && !isLoading && displayContent) {
      setTimeout(() => setBoxState("revealed"), 300);
    }
  }, [boxState, isLoading, displayContent]);

  const handleNext = async () => {
    setBoxState("opening");
    setShowParticles(true);
    refetch();
    setTimeout(() => {
      setShowParticles(false);
      setBoxState("loading");
    }, 1200);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[380px] select-none">
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {boxState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.button
              animate={{ scale: [1, 1.035, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleOpen}
              className="relative w-36 h-36 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/15 transition-all shadow-xl"
            >
              <span className="text-7xl drop-shadow-lg">🎁</span>
              {/* Glow ring */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl border-2 border-purple-300/30 pointer-events-none"
              />
            </motion.button>
            <div className="text-center space-y-2">
              <p className="text-white/90 text-lg font-medium">Chạm để mở không gian hôm nay</p>
              <p className="text-white/40 text-sm">Nội dung được chọn riêng cho bạn ✨</p>
            </div>
          </motion.div>
        )}

        {/* ── OPENING ── */}
        {boxState === "opening" && (
          <motion.div
            key="opening"
            className="relative flex flex-col items-center gap-4"
            initial={{ scale: 1 }}
          >
            {/* Particles */}
            {showParticles && Array.from({ length: particleCount }).map((_, i) => (
              <Particle key={i} delay={i * 0.035} />
            ))}
            {/* Box shake + explode animation */}
            <motion.div
              animate={{
                x: [0, -8, 8, -6, 6, -4, 4, 0],
                scale: [1, 1.05, 1.08, 1.12, 1.2, 1.15, 1.05, 1.5],
                opacity: [1, 1, 1, 1, 1, 0.8, 0.4, 0],
              }}
              transition={{ duration: 1.2, times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.85, 1], ease: "easeInOut" }}
              className="w-36 h-36 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center shadow-xl"
            >
              <span className="text-7xl">🎁</span>
            </motion.div>
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: 0 }}
              className="text-white/60 text-sm mt-2"
            >
              Đang mở hộp quà...
            </motion.p>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {boxState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md space-y-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-8 h-8"
            >
              <Sparkles size={32} className="text-purple-300" />
            </motion.div>
            <ContentSkeleton />
          </motion.div>
        )}

        {/* ── REVEALED ── */}
        {boxState === "revealed" && displayContent && (
          <motion.div
            key={`revealed-${displayContent.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full space-y-10"
          >
            <ContentRenderer content={displayContent} />

            {/* Nút Mở tiếp */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm transition-all shadow-lg"
              >
                <span>🎁</span>
                Mở tiếp
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
