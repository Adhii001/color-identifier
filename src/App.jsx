import { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import ColorPalette from './components/ColorPalette'
import { extractColors } from './utils/colorExtractor'
import { getColorName } from './utils/colorNamer'
import './App.css'

export default function App() {
  const [imageUrl, setImageUrl] = useState(null)
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageLoad = useCallback(async (dataUrl, imgElement) => {
    setImageUrl(dataUrl)
    setColors([])
    setError('')
    setLoading(true)

    try {
      const extracted = await extractColors(imgElement, 8)
      const named = extracted.map((c) => ({
        ...c,
        name: getColorName(c.rgb.r, c.rgb.g, c.rgb.b),
      }))
      setColors(named)
    } catch (err) {
      setError('Failed to extract colors. Please try a different image.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = () => {
    setImageUrl(null)
    setColors([])
    setError('')
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <span className="app__logo" aria-hidden="true">🎨</span>
          <div>
            <h1 className="app__title">Color Identifier</h1>
            <p className="app__subtitle">Upload an image to discover its dominant colors</p>
          </div>
        </div>
      </header>

      <main className="app__main">
        {!imageUrl ? (
          <div className="app__upload-section">
            <ImageUploader onImageLoad={handleImageLoad} />

            <div className="app__empty-state">
              <div className="app__empty-swatches" aria-hidden="true">
                {['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#a8dadc'].map((c) => (
                  <span key={c} className="app__empty-dot" style={{ background: c }} />
                ))}
              </div>
              <p className="app__empty-text">
                Upload any image and the app will analyze its pixels to identify the most
                prominent colors, along with their HEX codes, RGB values, and human-readable
                names.
              </p>
            </div>
          </div>
        ) : (
          <div className="app__results">
            <div className="app__image-row">
              <div className="app__image-wrap">
                <img src={imageUrl} alt="Uploaded" className="app__preview" />
              </div>

              <button className="app__reset" onClick={handleReset} aria-label="Upload a new image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload New Image
              </button>
            </div>

            {loading && (
              <div className="app__loading" aria-live="polite">
                <span className="app__spinner" aria-hidden="true" />
                Analyzing colors…
              </div>
            )}

            {error && (
              <p className="app__error" role="alert">
                {error}
              </p>
            )}

            {!loading && colors.length > 0 && <ColorPalette colors={colors} />}
          </div>
        )}
      </main>

      <footer className="app__footer">
        <p>Built with React · Canvas API color extraction</p>
      </footer>
    </div>
  )
}
