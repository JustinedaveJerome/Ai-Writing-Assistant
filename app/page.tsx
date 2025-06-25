import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Edit, FileText, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">AI-Powered Writing Assistant</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal guide through the entire writing process, from brainstorming to final draft with automated
            feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Start a New Essay
              </CardTitle>
              <CardDescription>Begin a new writing project with AI-powered guidance at every step.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get help with brainstorming topics, creating outlines, and drafting your essay with real-time feedback.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/write" className="w-full">
                <Button className="w-full">Create New Essay</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Essays
              </CardTitle>
              <CardDescription>Access your saved essays and continue working on drafts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View your writing history, track your progress, and see how your skills have improved over time.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/essays" className="w-full">
                <Button variant="outline" className="w-full">
                  View My Essays
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center h-12">
                  <BookOpen className="h-8 w-8 text-primary" />
                </CardTitle>
                <CardTitle className="text-center">Brainstorm & Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Get AI-powered topic suggestions based on your interests or course requirements, and create structured
                  outlines.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center h-12">
                  <Edit className="h-8 w-8 text-primary" />
                </CardTitle>
                <CardTitle className="text-center">Write & Refine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Receive real-time suggestions for improving grammar, sentence structure, and style as you write.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center h-12">
                  <BarChart className="h-8 w-8 text-primary" />
                </CardTitle>
                <CardTitle className="text-center">Grade & Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Get automated grading based on grammar, coherence, and argument strength, with personalized
                  improvement suggestions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
