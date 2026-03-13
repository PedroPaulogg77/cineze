import { useState, useCallback } from 'react'

interface YouTubeFacadeProps {
  videoId: string
  title?: string
  className?: string
}

export default function YouTubeFacade({
  videoId,
  title = 'Reproduzir vídeo',
  className = '',
}: YouTubeFacadeProps) {
  const [showPlayer, setShowPlayer] = useState(false)

  const handleClick = useCallback(() => {
    setShowPlayer(true)
  }, [])

  if (showPlayer) {
    return (
      <div className={`relative w-full aspect-video ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative w-full aspect-video group cursor-pointer rounded-xl overflow-hidden bg-black/90 ${className}`}
      aria-label={title}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-600 group-hover:bg-red-500 transition-colors flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  )
}
