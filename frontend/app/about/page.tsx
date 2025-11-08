
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, BarChart3, Lightbulb } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Prathamesh U Bavannavar",
      role: "Backend Developer",
      image: "https://thumbs.dreamstime.com/b/passport-document-id-photo-business-man-portrait-concept-young-handsome-stylish-guy-formal-wear-white-background-119717703.jpg",
    },
    {
      name: "Pruthviraj P Patil",
      role: "Project Manager",
      image: "https://thumbs.dreamstime.com/b/passport-document-id-photo-business-man-portrait-concept-young-handsome-stylish-guy-formal-wear-white-background-119717703.jpg",
    },
    {
      name: "Prathamesh P Pujari",
      role: "Frontend Developer",
      image: "https://thumbs.dreamstime.com/b/passport-document-id-photo-business-man-portrait-concept-young-handsome-stylish-guy-formal-wear-white-background-119717703.jpg",
    },
    {
      name: "Aryan J Patil",
      role: "Testing",
      image: "https://thumbs.dreamstime.com/b/passport-document-id-photo-business-man-portrait-concept-young-handsome-stylish-guy-formal-wear-white-background-119717703.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-300">About SmartProduct</h1>
          <p className="text-xl text-gray-400">
            We're on a mission to simplify product comparisons and help consumers make informed decisions through
            transparent, data-driven insights.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Our Story</h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              SmartProduct was founded in 2020 with a simple idea: make product comparisons easy, transparent, and accessible to everyone.
            </p>
            <p className="text-gray-300">
              After experiencing the frustration of comparing tech products across multiple websites and dealing with biased reviews, our founder Alex decided to create a platform that offers objective comparisons based on real specifications and user experiences.
            </p>
            <p className="text-gray-300">
              Today, we've helped over 500,000 consumers make better purchasing decisions through our detailed comparisons and analysis.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Our Values</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
            {[
              { badge: "01", title: "Transparency", desc: "We provide unbiased comparisons with clear methodology." },
              { badge: "02", title: "Accuracy", desc: "Our data is meticulously researched and regularly updated." },
              { badge: "03", title: "User-Centric", desc: "We design our tools with real user needs in mind." },
            ].map((val, i) => (
              <div key={i} className="flex items-start">
                <Badge className="mt-1 mr-3 bg-blue-900 text-blue-200">{val.badge}</Badge>
                <div>
                  <h4 className="font-medium text-white">{val.title}</h4>
                  <p className="text-gray-400">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-300 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BarChart3 />, title: "Side-by-Side Comparisons", text: "Compare products with detailed specification breakdowns and visual charts." },
              { icon: <Award />, title: "Expert Reviews", text: "In-depth analysis from our team of product specialists and industry experts." },
              { icon: <Users />, title: "Community Insights", text: "Real user feedback and ratings to complement technical specifications." },
              { icon: <Lightbulb />, title: "Buying Guides", text: "Tailored recommendations based on your specific needs and preferences." },
            ].map((item, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 min-h-[260px]">
                <CardContent className="p-6">
                  <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-10 text-blue-300 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-gray-800 border border-gray-700 hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-400"
                  />
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-blue-400 text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-blue-400">SmartProduct</h2>
              <p className="text-gray-400">Making product comparisons easy</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white">Privacy Policy</Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">Terms of Service</Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">Contact Us</Button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>&copy; 2025 SmartProduct. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
