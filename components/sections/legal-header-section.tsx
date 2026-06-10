export type LegalHeaderValue = {
  _type: 'legalHeader'
  _key: string
  heading: string
  subheading?: string
}

export function LegalHeaderSection({ value }: { value: LegalHeaderValue }) {
  return (
    <section className="bg-gradient-to-r from-[#1b75bc] to-[#007a5e] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{value.heading}</h1>
          {value.subheading && <p className="text-lg opacity-90">{value.subheading}</p>}
        </div>
      </div>
    </section>
  )
}
