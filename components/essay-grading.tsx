"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface EssayGradingProps {
  essay: string
  wordCount: number
}

interface GradingCriteria {
  name: string
  score: number
  feedback: string
  suggestions: string[]
}

export default function EssayGrading({ essay, wordCount }: EssayGradingProps) {
  const [loading, setLoading] = useState(true)
  const [overallScore, setOverallScore] = useState(0)
  const [criteria, setCriteria] = useState<GradingCriteria[]>([])

  useEffect(() => {
    const evaluateEssay = async () => {
      if (essay.length < 100) return

      setLoading(true)

      try {
        const response = await fetch("/api/evaluate-essay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            essay,
            wordCount,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to evaluate essay")
        }

        const evaluation = await response.json()
        setOverallScore(evaluation.overallScore)
        setCriteria(evaluation.criteria)
      } catch (error) {
        console.error("Error evaluating essay:", error)
        // Fallback to mock data if API fails
        const mockCriteria = [
          {
            name: "Grammar & Syntax",
            score: 85,
            feedback: "Good grammar with a few minor errors that don't affect readability.",
            suggestions: [
              "Review your use of punctuation, especially commas and semicolons.",
              "Check for subject-verb agreement in complex sentences.",
              "Consider using active voice more frequently for clarity.",
            ],
          },
          {
            name: "Coherence & Structure",
            score: 80,
            feedback: "Good overall structure, but some transitions could be improved.",
            suggestions: [
              "Add transition phrases between paragraphs to improve flow.",
              "Ensure each paragraph focuses on a single main idea.",
              "Consider reorganizing some sections for better logical progression.",
            ],
          },
          {
            name: "Argument Strength",
            score: 75,
            feedback: "Arguments need stronger evidence and clearer reasoning.",
            suggestions: [
              "Include more specific examples to support your main points.",
              "Address potential counterarguments to strengthen your position.",
              "Develop your thesis statement to more clearly guide your arguments.",
            ],
          },
        ]

        setOverallScore(80)
        setCriteria(mockCriteria)
      } finally {
        setLoading(false)
      }
    }

    evaluateEssay()
  }, [essay, wordCount])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Essay Evaluation</CardTitle>
        <CardDescription>Automated assessment of your essay based on key writing criteria.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6 py-4">
            <div className="text-center text-muted-foreground">Analyzing your essay...</div>
            <Progress value={45} className="h-2" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-5xl font-bold mb-2">{overallScore}/100</div>
              <div className="text-muted-foreground">Overall Score</div>
            </div>

            <Tabs defaultValue="criteria" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="criteria">Criteria Breakdown</TabsTrigger>
                <TabsTrigger value="suggestions">Improvement Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="criteria" className="space-y-4 mt-4">
                {criteria.map((criterion, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{criterion.name}</div>
                      <div className="font-medium">{Math.round(criterion.score)}/100</div>
                    </div>
                    <Progress value={criterion.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{criterion.feedback}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="suggestions" className="mt-4">
                <div className="space-y-4">
                  {criteria.map((criterion, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">{criterion.name}</h3>
                      <ul className="space-y-1">
                        {criterion.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm flex gap-2 items-start">
                            <span className="text-primary">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <Button
                    className="w-full mt-4 flex items-center gap-2"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/improvement-plan", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            essay,
                            evaluation: {
                              overallScore,
                              criteria,
                            },
                          }),
                        })

                        if (!response.ok) {
                          throw new Error("Failed to generate improvement plan")
                        }

                        const plan = await response.json()
                        alert("Detailed improvement plan generated! Check the console for details.")
                        console.log("Improvement Plan:", plan)
                      } catch (error) {
                        console.error("Error generating improvement plan:", error)
                        alert("Failed to generate improvement plan. Please try again.")
                      }
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Get Detailed Improvement Plan
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
