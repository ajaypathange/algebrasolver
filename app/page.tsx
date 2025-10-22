"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calculator, Zap, BarChart3, BookOpen } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Calculator,
      title: "Equation Solver",
      description: "Solve complex equations step-by-step with detailed explanations",
      href: "/solver",
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Expression Simplifier",
      description: "Simplify algebraic expressions and see the process",
      href: "/simplifier",
      color: "bg-purple-500",
    },
    {
      icon: BarChart3,
      title: "Graph Visualizer",
      description: "Visualize functions and equations on interactive graphs",
      href: "/graph",
      color: "bg-green-500",
    },
    {
      icon: BookOpen,
      title: "Practice Problems",
      description: "Test your skills with curated practice problems",
      href: "/practice",
      color: "bg-orange-500",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">∑</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">MathMaster</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/progress">
              <Button variant="ghost">Progress</Button>
            </Link>
            <Button>Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
          Master Mathematics with AI-Powered Learning
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-balance">
          Solve equations, simplify expressions, visualize graphs, and practice problems all in one place
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/solver">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Our Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 dark:bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Problems Solved</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5K+</div>
              <p className="text-blue-100">Active Learners</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 MathMaster. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
