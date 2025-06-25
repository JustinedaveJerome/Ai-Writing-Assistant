"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wand2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

interface WritingEditorProps {
  title: string
  essayType: string
  wordCount: number
  outline: string
  essay: string
  setEssay: (essay: string) => void
  selectedTopic: string
}

export default function WritingEditor({
  title,
  essayType,
  wordCount,
  outline,
  essay,
  setEssay,
  selectedTopic,
}: WritingEditorProps) {
  const [currentWordCount, setCurrentWordCount] = useState(0)
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)
  const [suggestions, setSuggestions] = useState<{
    grammar: { text: string; type: "warning" | "success" }[]
    style: { text: string; type: "warning" | "success" }[]
  }>({
    grammar: [],
    style: [],
  })

  // Calculate word count whenever essay changes
  useEffect(() => {
    if (essay) {
      const words = essay.trim().split(/\s+/).filter(Boolean).length
      setCurrentWordCount(words)

      // Simulate real-time suggestions based on essay content
      if (words > 50) {
        // This is where you would integrate with an AI service
        // For now, we'll use mock suggestions
        generateMockSuggestions(essay)
      } else {
        setSuggestions({ grammar: [], style: [] })
      }
    } else {
      setCurrentWordCount(0)
      setSuggestions({ grammar: [], style: [] })
    }
  }, [essay])

  const generateMockSuggestions = (text: string) => {
    // Mock grammar suggestions
    const grammarSuggestions = []

    if (text.includes("their is")) {
      grammarSuggestions.push({
        text: "Consider replacing 'their is' with 'there is'",
        type: "warning" as const,
      })
    }

    if (text.includes("  ")) {
      grammarSuggestions.push({
        text: "Multiple spaces detected. Consider using single spaces between words.",
        type: "warning" as const,
      })
    }

    if (text.length > 100 && !text.includes(",")) {
      grammarSuggestions.push({
        text: "Consider using commas to break up long sentences for better readability.",
        type: "warning" as const,
      })
    }

    // Mock style suggestions
    const styleSuggestions = []

    if (text.toLowerCase().includes("very ")) {
      styleSuggestions.push({
        text: "Consider replacing 'very' with a stronger, more specific adjective.",
        type: "warning" as const,
      })
    }

    if (text.split(".").some((sentence) => sentence.split(" ").length > 25)) {
      styleSuggestions.push({
        text: "Some sentences are quite long. Consider breaking them into shorter sentences for clarity.",
        type: "warning" as const,
      })
    }

    if (currentWordCount > wordCount * 0.8) {
      styleSuggestions.push({
        text: "You're approaching your target word count. Consider starting your conclusion soon.",
        type: "success" as const,
      })
    }

    setSuggestions({
      grammar: grammarSuggestions,
      style: styleSuggestions,
    })
  }

  const handleGenerateDraft = async () => {
    if (!title || !essayType || !selectedTopic || !outline) {
      alert("Please complete the outline before generating a draft")
      return
    }

    setIsGeneratingDraft(true)

    try {
      const response = await fetch("/api/generate-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          essayType,
          topic: selectedTopic,
          outline,
          wordCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate draft")
      }

      const data = await response.json()
      setEssay(data.draft)
    } catch (error) {
      console.error("Error generating draft:", error)
      alert("Failed to generate draft. Please try again.")
    } finally {
      setIsGeneratingDraft(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Write Your Essay</CardTitle>
            <CardDescription>
              Draft your essay based on your outline. You'll receive real-time feedback as you write.
            </CardDescription>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <Badge variant="outline">{essayType || "No type"}</Badge>
                <Badge variant="outline" className={currentWordCount > wordCount ? "bg-red-100" : ""}>
                  {currentWordCount}/{wordCount} words
                </Badge>
                {selectedTopic && <Badge variant="outline">{selectedTopic}</Badge>}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleGenerateDraft}
                disabled={isGeneratingDraft}
              >
                {isGeneratingDraft ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="mb-2">
              <Progress value={(currentWordCount / wordCount) * 100} className="h-2" />
            </div>
            <Textarea
              placeholder="Start writing your essay here..."
              className="flex-grow min-h-[400px] font-mono"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Writing Assistant</CardTitle>
            <CardDescription>Real-time suggestions to improve your writing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="outline" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="grammar">Grammar</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="outline" className="mt-4 space-y-4">
                <div className="whitespace-pre-wrap font-mono text-sm border rounded-md p-3 bg-muted/50 max-h-[400px] overflow-y-auto">
                  {outline || "No outline created yet."}
                </div>
              </TabsContent>

              <TabsContent value="grammar" className="mt-4 space-y-4">
                {suggestions.grammar.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.grammar.map((suggestion, index) => (
                      <Alert key={index} variant={suggestion.type === "warning" ? "destructive" : "default"}>
                        {suggestion.type === "warning" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <AlertTitle>Grammar Suggestion</AlertTitle>
                        <AlertDescription>{suggestion.text}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {currentWordCount > 0
                      ? "No grammar issues detected. Keep writing!"
                      : "Start writing to receive grammar suggestions."}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="style" className="mt-4 space-y-4">
                {suggestions.style.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.style.map((suggestion, index) => (
                      <Alert key={index} variant={suggestion.type === "warning" ? "default" : "default"}>
                        {suggestion.type === "warning" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <AlertTitle>Style Suggestion</AlertTitle>
                        <AlertDescription>{suggestion.text}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {currentWordCount > 0
                      ? "No style suggestions at the moment. Keep writing!"
                      : "Start writing to receive style suggestions."}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
