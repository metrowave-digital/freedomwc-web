"use client";

import React, { useEffect, useCallback } from "react";
import styles from "./YoutubeVideoModal.module.css";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const getYoutubeId = (url: string): string | null => {
  try {
    if (url.includes("youtu.be")) return url.split("/").pop()?.split("?")[0] ?? null;
    const u = new URL(url);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
};

const getYoutubeEmbedUrl = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
};

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  // Disable body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key closes modal
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  const embed = getYoutubeEmbedUrl(videoUrl);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close Video">
          <X size={28} />
        </button>

        <div className={styles.videoWrapper}>
          <iframe
            src={embed}
            title="Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
