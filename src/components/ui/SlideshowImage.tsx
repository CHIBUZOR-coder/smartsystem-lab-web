import { AnimatePresence, motion } from 'framer-motion'

interface SlideshowImageProps {
  images: string[]
  index: number
  alt: string
  onError?: () => void
}

// Crossfades between images with a slow Ken-Burns-style zoom, instead of a
// hard swap or directional swipe. Parent element must be `relative overflow-hidden`.
const SlideshowImage = ({ images, index, alt, onError }: SlideshowImageProps) => {
  const src = images[index]
  if (!src) return null

  return (
    <AnimatePresence mode="sync">
      <motion.img
        key={`${index}-${src}`}
        src={src}
        alt={alt}
        onError={onError}
        loading="lazy"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ opacity: { duration: 1, ease: 'easeInOut' }, scale: { duration: 3.5, ease: 'easeOut' } }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </AnimatePresence>
  )
}

export default SlideshowImage
