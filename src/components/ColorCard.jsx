import { useState } from 'react'
import './ColorCard.css'

export default function ColorCard({ color, rank }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(color.hex.toUpperCase())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available – silently ignore
    }
  }

  return (
    <article className="color-card" aria-label={`${color.name}, ${color.hex}`}>
      <div
        className="color-card__swatch"
        style={{ background: color.hex }}
        aria-hidden="true"
      >
        <span className="color-card__rank">#{rank}</span>
      </div>

      <div className="color-card__body">
        <p className="color-card__name">{color.name}</p>
        <button
          className="color-card__hex"
          onClick={handleCopy}
          title="Click to copy HEX code"
          aria-label={`Copy hex code ${color.hex}`}
        >
          {copied ? '✓ Copied!' : color.hex.toUpperCase()}
        </button>
        <p className="color-card__rgb">
          rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
        </p>
        <div className="color-card__bar-wrap" aria-label={`${color.percentage}% of image`}>
          <div
            className="color-card__bar"
            style={{ width: `${Math.min(color.percentage, 100)}%` }}
          />
        </div>
        <p className="color-card__pct">{color.percentage}%</p>
      </div>
    </article>
  )
}
