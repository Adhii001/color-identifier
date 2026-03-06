import ColorCard from './ColorCard'
import './ColorPalette.css'

export default function ColorPalette({ colors }) {
  if (!colors || colors.length === 0) return null

  const dominant = colors[0]

  return (
    <section className="palette">
      <h2 className="palette__heading">Dominant Colors</h2>

      {/* Hero swatch – most dominant color */}
      <div className="palette__hero">
        <div
          className="palette__hero-swatch"
          style={{ background: dominant.hex }}
          aria-label={`Dominant color: ${dominant.name}`}
        />
        <div className="palette__hero-info">
          <span className="palette__hero-badge">🎨 Most Dominant</span>
          <h3 className="palette__hero-name">{dominant.name}</h3>
          <p className="palette__hero-hex">{dominant.hex.toUpperCase()}</p>
          <p className="palette__hero-rgb">
            rgb({dominant.rgb.r}, {dominant.rgb.g}, {dominant.rgb.b})
          </p>
          <p className="palette__hero-pct">{dominant.percentage}% of image</p>
        </div>
      </div>

      {/* Grid of all extracted colors */}
      <div className="palette__grid">
        {colors.map((color, index) => (
          <ColorCard key={color.hex + index} color={color} rank={index + 1} />
        ))}
      </div>
    </section>
  )
}
