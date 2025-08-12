import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Linkedin, Mail, Phone, MapPin, Calendar, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllTeamMembers, getTeamMemberBySlug } from "@/lib/contentful"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getTeamMemberBySlug(params.slug)

  if (!member) {
    return {
      title: "Team Member Not Found - HELOC360",
    }
  }

  return {
    title: `${member.name} - ${member.title || 'Team Member'} | HELOC360 Team`,
    description: member.bio || `Meet ${member.name}, a valued member of the HELOC360 team.`,
    alternates: {
      canonical: `https://heloc360.com/meet-our-team/${member.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const teamMembers = await getAllTeamMembers()
  return teamMembers.map((member) => ({
    slug: member.slug,
  }))
}

export default async function TeamMemberPage({ params }: Props) {
  const member = await getTeamMemberBySlug(params.slug)

  if (!member) {
    notFound()
  }

  // Get other team members for the "Meet Other Team Members" section
  const allTeamMembers = await getAllTeamMembers()
  const otherMembers = allTeamMembers.filter(m => m.slug !== member.slug).slice(0, 3)

  return (
    <>
      {/* Back Navigation */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link
            href="/about"
            className="inline-flex items-center text-[#1b75bc] hover:text-[#1b75bc]/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Profile Image and Basic Info */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={`${member.name} - ${member.title || 'Team Member'}`}
                        fill
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                    <CardTitle className="text-2xl text-[#1b75bc]">{member.name}</CardTitle>
                    <p className="text-[#02c39a] font-semibold text-lg">{member.title}</p>

                    {member.email && (
                      <div className="flex items-center justify-center text-gray-600 mt-2">
                        <Mail className="w-4 h-4 mr-1" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    )}

                    {member.phone && (
                      <div className="flex items-center justify-center text-gray-600 mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-3" />
                          <span className="text-sm">{member.email}</span>
                        </a>
                      )}

                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-3" />
                          <span className="text-sm">{member.phone}</span>
                        </a>
                      )}

                      {member.linkedIn && (
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                        >
                          <Linkedin className="w-4 h-4 mr-3" />
                          <span className="text-sm">Connect on LinkedIn</span>
                        </a>
                      )}

                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span className="text-sm">Follow on Twitter</span>
                        </a>
                      )}
                    </div>

                    <Button className="w-full bg-[#1b75bc] hover:bg-[#1b75bc]/90" asChild>
                      <Link href="/contact">Schedule a Consultation</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio */}
                <div>
                  <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">About {member.name.split(" ")[0]}</h2>
                  <div className="prose prose-gray max-w-none">
                    {member.bio ? (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {member.bio}
                      </p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {member.name} is a valued member of the HELOC360 team, contributing their expertise and dedication to helping homeowners access their home equity.
                      </p>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-8 text-center">Meet Other Team Members</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {otherMembers.map((otherMember) => (
                  <Card key={otherMember.id} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                          src={otherMember.image || "/placeholder.svg"}
                          alt={`${otherMember.name} - ${otherMember.title || 'Team Member'}`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg text-[#1b75bc]">{otherMember.name}</CardTitle>
                      <p className="text-[#02c39a] font-medium text-sm">{otherMember.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{otherMember.bio}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/meet-our-team/${otherMember.slug}`}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Work with {member.name.split(" ")[0]}?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get personalized guidance from our expert team to unlock your home's equity potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1b75bc] hover:bg-gray-100">
                Get Pre-Qualified
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
