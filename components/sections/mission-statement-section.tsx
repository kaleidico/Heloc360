type MissionPoint = { _key: string; heading?: string; body?: string }

export type MissionStatementValue = {
  _type: 'missionStatement'
  _key: string
  heading: string
  lead?: string
  boxHeading?: string
  points?: MissionPoint[]
}

// Verbatim reproduction of the about page "Our Mission" section.
export function MissionStatementSection({ value }: { value: MissionStatementValue }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-6">{value.heading}</h2>
          {value.lead && <p className="text-xl text-gray-700 mb-8 leading-relaxed">{value.lead}</p>}
          <div className="bg-gradient-to-r from-[#1a71b6]/10 to-[#007a5e]/10 p-8 rounded-lg">
            {value.boxHeading && (
              <h3 className="text-2xl font-semibold text-[#1a71b6] mb-4">{value.boxHeading}</h3>
            )}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {(value.points || []).map((point) => (
                <div key={point._key}>
                  <h4 className="font-semibold text-gray-900 mb-2">{point.heading}</h4>
                  <p className="text-gray-600 text-sm">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
