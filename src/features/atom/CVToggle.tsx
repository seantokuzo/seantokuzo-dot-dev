import { useState, useRef, useCallback } from 'react'
import { useCVStore } from '../../store/useCVStore'
import { CVManager } from '../../cv/CVManager'
import { CameraPreview, type CameraPreviewHandle } from '../../cv/CameraPreview'
import styles from './CVToggle.module.css'

export function CVToggle() {
  const isCVEnabled = useCVStore((s) => s.isCVEnabled)
  const setCVEnabled = useCVStore((s) => s.setCVEnabled)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)
  const managerRef = useRef<CVManager | null>(null)
  const previewRef = useRef<CameraPreviewHandle>(null)

  const startCV = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const manager = new CVManager()
      managerRef.current = manager

      await manager.init()
      const videoEl = await manager.startCamera()
      setVideo(videoEl)

      manager.startTracking((landmarks) => {
        previewRef.current?.updateLandmarks(landmarks)
      })

      setCVEnabled(true)
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied'
          : 'Failed to start CV'
      setError(msg)
      managerRef.current?.dispose()
      managerRef.current = null
    } finally {
      setLoading(false)
    }
  }, [setCVEnabled])

  const stopCV = useCallback(() => {
    managerRef.current?.dispose()
    managerRef.current = null
    setVideo(null)
    setCVEnabled(false)
  }, [setCVEnabled])

  return (
    <>
      <button
        className={`${styles.toggle} ${isCVEnabled ? styles.active : ''}`}
        onClick={isCVEnabled ? stopCV : startCV}
        disabled={loading}
        aria-label={isCVEnabled ? 'Disable gesture controls' : 'Enable gesture controls'}
      >
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
        {isCVEnabled ? 'CV On' : 'CV Off'}
      </button>

      {error && <span className={styles.error}>{error}</span>}

      {isCVEnabled && video && (
        <CameraPreview ref={previewRef} video={video} />
      )}
    </>
  )
}
