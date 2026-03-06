import { useState, useRef, useCallback } from 'react'
import './ImageUploader.css'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp']

export default function ImageUploader({ onImageLoad }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = useCallback(
    (file) => {
      setError('')
      if (!file) return

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Unsupported file type. Please upload a PNG, JPG, GIF, BMP, or WebP image.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        const img = new Image()
        img.onload = () => onImageLoad(dataUrl, img)
        img.onerror = () => setError('Could not load image. Please try another file.')
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    },
    [onImageLoad],
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => setDragOver(false)

  const onInputChange = (e) => {
    handleFile(e.target.files[0])
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      className={`uploader${dragOver ? ' uploader--drag-over' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
      aria-label="Upload an image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/bmp,image/webp"
        onChange={onInputChange}
        className="uploader__input"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="uploader__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <p className="uploader__title">
        {dragOver ? 'Drop your image here' : 'Drag & drop an image here'}
      </p>
      <p className="uploader__subtitle">or click to browse files</p>
      <p className="uploader__formats">PNG, JPG, GIF, BMP, WEBP supported</p>

      {error && (
        <p className="uploader__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
