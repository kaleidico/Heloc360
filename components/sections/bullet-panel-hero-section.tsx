export type BulletPanelHeroValue = {
  _type: 'bulletPanelHero'
  _key: string
  heading: string
  subheading?: string
  panelHeading?: string
  bullets?: string[]
}

// Verbatim from the debt-consolidation calculator hero — blue-900→blue-700
// gradient (not the brand gradient), centered copy, translucent bullet panel.
// The "• " bullet prefix is rendered here, not stored in content.
export function BulletPanelHeroSection({ value }: { value: BulletPanelHeroValue }) {
  const bullets = value.bullets ?? []
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{value.heading}</h1>
          {value.subheading && <p className="text-xl md:text-2xl mb-8 text-blue-100">{value.subheading}</p>}
          {(value.panelHeading || bullets.length > 0) && (
            <div className="bg-blue-800/30 rounded-lg p-6 text-left max-w-2xl mx-auto">
              {value.panelHeading && <h2 className="font-semibold mb-3">{value.panelHeading}</h2>}
              {bullets.length > 0 && (
                <ul className="space-y-2 text-blue-100">
                  {bullets.map((bullet, i) => (
                    <li key={i}>• {bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
