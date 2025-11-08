import { useSpring, animated, config } from "react-spring"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Award, BarChart3, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  })

  const staggeredFadeIn = (delay: number) => {
    const spring = useSpring({
      from: { opacity: 0, transform: "translateY(30px)" },
      to: { opacity: 1, transform: "translateY(0)" },
      delay: delay * 100,
      config: config.gentle,
    })
    return spring
  }

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=150&width=150",
      description: "Tech enthusiast with 10+ years in product comparison and analysis.",
    },
    {
      name: "Sarah Chen",
      role: "Head of Research",
      image: "/placeholder.svg?height=150&width=150",
      description: "Consumer electronics expert specializing in detailed product evaluations.",
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Developer",
      image: "/placeholder.svg?height=150&width=150",
      description: "Full-stack developer passionate about creating intuitive user experiences.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" passHref>
            <h1 className="text-2xl font-bold text-blue-400 cursor-pointer">SmartProduct</h1>
          </Link>
          <div className="flex space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">
                Home
              </Button>
            </Link>
            <Button variant="ghost" className="text-gray-300 hover:bg-white hover:text-gray-900">
              Categories
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white bg-white/10">
              About
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">
              Contact
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <animated.section style={fadeIn} className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blue-300">About SmartProduct</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            We're on a mission to simplify product comparisons and help consumers make informed decisions through
            transparent, data-driven insights.
          </p>
        </animated.section>

        {/* Our Story */}
        <animated.section style={staggeredFadeIn(1)} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-300 mb-4">
                SmartProduct was founded in 2020 with a simple idea: make product comparisons easy, transparent, and
                accessible to everyone.
              </p>
              <p className="text-gray-300 mb-4">
                After experiencing the frustration of comparing tech products across multiple websites and dealing with
                biased reviews, our founder Alex decided to create a platform that offers objective comparisons based on
                real specifications and user experiences.
              </p>
              <p className="text-gray-300">
                Today, we've helped over 500,000 consumers make better purchasing decisions through our detailed
                comparisons and analysis.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Badge className="mt-1 mr-3 bg-blue-900 text-blue-200">01</Badge>
                  <div>
                    <h4 className="font-medium text-white">Transparency</h4>
                    <p className="text-gray-400">We provide unbiased comparisons with clear methodology.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge className="mt-1 mr-3 bg-blue-900 text-blue-200">02</Badge>
                  <div>
                    <h4 className="font-medium text-white">Accuracy</h4>
                    <p className="text-gray-400">Our data is meticulously researched and regularly updated.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge className="mt-1 mr-3 bg-blue-900 text-blue-200">03</Badge>
                  <div>
                    <h4 className="font-medium text-white">User-Centric</h4>
                    <p className="text-gray-400">We design our tools with real user needs in mind.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </animated.section>

        {/* What We Offer */}
        <animated.section style={staggeredFadeIn(2)} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-blue-300 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Side-by-Side Comparisons</h3>
                <p className="text-gray-400">
                  Compare products with detailed specification breakdowns and visual charts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-blue-300 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Expert Reviews</h3>
                <p className="text-gray-400">
                  In-depth analysis from our team of product specialists and industry experts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-300 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Community Insights</h3>
                <p className="text-gray-400">Real user feedback and ratings to complement technical specifications.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="text-blue-300 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Buying Guides</h3>
                <p className="text-gray-400">Tailored recommendations based on your specific needs and preferences.</p>
              </CardContent>
            </Card>
          </div>
        </animated.section>

        {/* Team Section */}
        <animated.section style={staggeredFadeIn(3)} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-blue-300 mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </animated.section>

        {/* Call to Action */}
        <animated.section style={fadeIn} className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-300">Ready to Make Smarter Choices?</h2>
          <p className="text-xl text-gray-400 mb-8">Start comparing products today and find exactly what you need</p>
          <Link href="/" passHref>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Start Comparing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </animated.section>
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-blue-400">SmartProduct</h2>
              <p className="text-gray-400">Making product comparisons easy</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Terms of Service
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Contact Us
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>&copy; 2025 SmartProduct. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

