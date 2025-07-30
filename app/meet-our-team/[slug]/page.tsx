import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Linkedin, Mail, Phone, MapPin, Calendar, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Placeholder team data - will be replaced with Contentful data
const teamMembers = {
  "sarah-johnson": {
    id: 1,
    name: "Sarah Johnson",
    title: "CEO & Founder",
    slug: "sarah-johnson",
    image: "/placeholder.svg?height=400&width=400&text=Sarah+Johnson",
    bio: "With over 15 years in mortgage lending, Sarah founded HELOC360 to make home equity accessible to all homeowners. Her vision was to create a platform that combines expert guidance with cutting-edge technology to simplify the HELOC process.",
    longBio:
      "Sarah's journey in financial services began at a traditional bank where she witnessed firsthand the challenges homeowners faced when trying to access their home equity. After spending over a decade helping customers navigate complex lending processes, she recognized the need for a more transparent, educational approach to home equity lending.\n\nIn 2020, Sarah founded HELOC360 with the mission to democratize access to home equity. Under her leadership, the company has helped over 10,000 homeowners access more than $500 million in home equity, while maintaining a 98% customer satisfaction rate.\n\nSarah holds an MBA in Finance from Northwestern Kellogg and is a licensed mortgage loan originator. She frequently speaks at industry conferences about innovation in mortgage lending and consumer financial education.",
    expertise: [
      "Mortgage Lending Strategy",
      "Financial Technology",
      "Consumer Education",
      "Regulatory Compliance",
      "Team Leadership",
    ],
    achievements: [
      "Founded HELOC360 in 2020",
      "Helped 10,000+ homeowners access home equity",
      "Featured in Mortgage Professional Magazine",
      "Speaker at FinTech Innovation Summit 2023",
      "MBA in Finance from Northwestern Kellogg",
    ],
    contact: {
      email: "sarah@heloc360.com",
      linkedin: "https://linkedin.com/in/sarah-johnson-heloc360",
      phone: "+1 (555) 123-4567",
    },
    location: "Chicago, IL",
    joinedDate: "2020-01-15",
    education: [
      {
        degree: "MBA in Finance",
        school: "Northwestern Kellogg School of Management",
        year: "2015",
      },
      {
        degree: "Bachelor of Business Administration",
        school: "University of Illinois",
        year: "2008",
      },
    ],
  },
  "michael-chen": {
    id: 2,
    name: "Michael Chen",
    title: "Head of Lending Operations",
    slug: "michael-chen",
    image: "/placeholder.svg?height=400&width=400&text=Michael+Chen",
    bio: "Michael brings 12 years of experience in financial services, specializing in home equity products and lender relations. He ensures our lending partners meet the highest standards of service and competitive rates.",
    longBio:
      "Michael joined HELOC360 as one of the founding team members, bringing extensive experience from his previous roles at major financial institutions. His expertise in lending operations and risk management has been instrumental in building HELOC360's network of vetted lender partners.\n\nBefore HELOC360, Michael spent 8 years at Wells Fargo, where he managed a portfolio of home equity products and developed relationships with institutional lenders. His deep understanding of the lending landscape allows him to negotiate the best terms for HELOC360 customers.\n\nMichael is passionate about using technology to streamline lending processes while maintaining the highest standards of compliance and customer service.",
    expertise: [
      "Lending Operations",
      "Risk Management",
      "Lender Relations",
      "Process Optimization",
      "Regulatory Compliance",
    ],
    achievements: [
      "Built network of 50+ vetted lenders",
      "Reduced average processing time by 40%",
      "Maintained 99.8% compliance rate",
      "Certified Risk Management Professional",
      "Led digital transformation initiatives",
    ],
    contact: {
      email: "michael@heloc360.com",
      linkedin: "https://linkedin.com/in/michael-chen-heloc360",
      phone: "+1 (555) 123-4568",
    },
    location: "San Francisco, CA",
    joinedDate: "2020-02-01",
    education: [
      {
        degree: "Master of Finance",
        school: "UC Berkeley Haas School of Business",
        year: "2012",
      },
      {
        degree: "Bachelor of Economics",
        school: "UCLA",
        year: "2009",
      },
    ],
  },
  "emily-rodriguez": {
    id: 3,
    name: "Emily Rodriguez",
    title: "Customer Success Director",
    slug: "emily-rodriguez",
    image: "/placeholder.svg?height=400&width=400&text=Emily+Rodriguez",
    bio: "Emily ensures every customer has an exceptional experience, from initial consultation through loan closing. Her dedication to customer success has helped HELOC360 achieve industry-leading satisfaction rates.",
    longBio:
      "Emily's career in customer success spans over 10 years, with a focus on financial services and mortgage lending. She joined HELOC360 to build a customer success program that puts homeowners first, ensuring they have the support and guidance needed throughout their HELOC journey.\n\nUnder Emily's leadership, HELOC360 has achieved a 98% customer satisfaction rate and a Net Promoter Score of 85. She has developed comprehensive educational resources and support systems that help customers make informed decisions about their home equity.\n\nEmily is certified in Customer Success Management and regularly contributes to industry publications about best practices in customer experience.",
    expertise: [
      "Customer Success Strategy",
      "Customer Experience Design",
      "Team Management",
      "Process Improvement",
      "Customer Education",
    ],
    achievements: [
      "Achieved 98% customer satisfaction rate",
      "Built customer success team of 15+ specialists",
      "Developed comprehensive onboarding program",
      "Certified Customer Success Manager",
      "Reduced customer complaints by 75%",
    ],
    contact: {
      email: "emily@heloc360.com",
      linkedin: "https://linkedin.com/in/emily-rodriguez-heloc360",
      phone: "+1 (555) 123-4569",
    },
    location: "Austin, TX",
    joinedDate: "2020-03-15",
    education: [
      {
        degree: "Master of Business Administration",
        school: "University of Texas McCombs",
        year: "2014",
      },
      {
        degree: "Bachelor of Communications",
        school: "University of Texas at Austin",
        year: "2011",
      },
    ],
  },
  "david-thompson": {
    id: 4,
    name: "David Thompson",
    title: "Technology Director",
    slug: "david-thompson",
    image: "/placeholder.svg?height=400&width=400&text=David+Thompson",
    bio: "David leads our technology initiatives, creating tools and platforms that simplify the HELOC process for customers. His innovative approach has revolutionized how homeowners access and understand their equity options.",
    longBio:
      "David brings over 14 years of experience in financial technology, with a particular focus on mortgage and lending platforms. He joined HELOC360 to build technology solutions that make home equity accessible and understandable for all homeowners.\n\nBefore HELOC360, David was the Lead Architect at Quicken Loans, where he helped develop the digital mortgage platform that revolutionized online lending. His expertise in both traditional lending processes and modern technology allows him to create solutions that are both powerful and user-friendly.\n\nDavid holds multiple patents in financial technology and is a frequent speaker at FinTech conferences about the future of digital lending.",
    expertise: [
      "Financial Technology",
      "Software Architecture",
      "Digital Transformation",
      "API Development",
      "Data Security",
    ],
    achievements: [
      "Built HELOC360's proprietary matching platform",
      "Holds 3 patents in financial technology",
      "Reduced application processing time by 60%",
      "Led team that won FinTech Innovation Award",
      "Certified Solutions Architect",
    ],
    contact: {
      email: "david@heloc360.com",
      linkedin: "https://linkedin.com/in/david-thompson-heloc360",
      phone: "+1 (555) 123-4570",
    },
    location: "Seattle, WA",
    joinedDate: "2020-04-01",
    education: [
      {
        degree: "Master of Computer Science",
        school: "Stanford University",
        year: "2010",
      },
      {
        degree: "Bachelor of Computer Engineering",
        school: "University of Washington",
        year: "2008",
      },
    ],
  },
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = teamMembers[params.slug as keyof typeof teamMembers]

  if (!member) {
    return {
      title: "Team Member Not Found - HELOC360",
    }
  }

  return {
    title: `${member.name} - ${member.title} | HELOC360 Team`,
    description: member.bio,
    alternates: {
      canonical: `https://heloc360.com/meet-our-team/${member.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(teamMembers).map((slug) => ({
    slug: slug,
  }))
}

export default function TeamMemberPage({ params }: Props) {
  const member = teamMembers[params.slug as keyof typeof teamMembers]

  if (!member) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <>
      {/* Back Navigation */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link
            href="/about#team"
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
                        alt={`${member.name} - ${member.title}`}
                        fill
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                    <CardTitle className="text-2xl text-[#1b75bc]">{member.name}</CardTitle>
                    <p className="text-[#02c39a] font-semibold text-lg">{member.title}</p>

                    <div className="flex items-center justify-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{member.location}</span>
                    </div>

                    <div className="flex items-center justify-center text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">Joined {formatDate(member.joinedDate)}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-3" />
                        <span className="text-sm">{member.contact.email}</span>
                      </a>

                      <a
                        href={`tel:${member.contact.phone}`}
                        className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-3" />
                        <span className="text-sm">{member.contact.phone}</span>
                      </a>

                      <a
                        href={member.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                      >
                        <Linkedin className="w-4 h-4 mr-3" />
                        <span className="text-sm">Connect on LinkedIn</span>
                      </a>
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
                    {member.longBio.split("\n").map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#1b75bc]/10 text-[#1b75bc] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Key Achievements</h3>
                  <div className="space-y-3">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Education</h3>
                  <div className="space-y-4">
                    {member.education.map((edu, index) => (
                      <Card key={index} className="border-l-4 border-l-[#02c39a]">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">Class of {edu.year}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1b75bc] mb-8 text-center">Meet Other Team Members</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.values(teamMembers)
                .filter((otherMember) => otherMember.slug !== member.slug)
                .slice(0, 3)
                .map((otherMember) => (
                  <Card key={otherMember.id} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                          src={otherMember.image || "/placeholder.svg"}
                          alt={`${otherMember.name} - ${otherMember.title}`}
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
