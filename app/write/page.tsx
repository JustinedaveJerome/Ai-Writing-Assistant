"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
// Update the import for RefreshCw
import { ArrowLeft, BookOpen, Edit, Lightbulb, Wand2 } from "lucide-react"
import Link from "next/link"
import TopicSuggestions from "@/components/topic-suggestions"
import WritingEditor from "@/components/writing-editor"
import EssayGrading from "@/components/essay-grading"
import { useRouter } from "next/navigation"
import { saveEssay } from "@/lib/essay-storage"

export default function WritePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("brainstorm")
  const [title, setTitle] = useState("")
  const [essayType, setEssayType] = useState("")
  const [wordCount, setWordCount] = useState(500)
  const [outline, setOutline] = useState("")
  const [essay, setEssay] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [essayId, setEssayId] = useState<string | null>(null)
  const [generatingOutline, setGeneratingOutline] = useState(false)

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic)
  }

  const handleNextTab = (current: string, next: string) => {
    // Simple validation before proceeding
    if (current === "brainstorm" && (!title || !essayType || !selectedTopic)) {
      alert("Please fill in all required fields before proceeding")
      return
    }

    if (current === "outline" && !outline) {
      alert("Please create an outline before proceeding")
      return
    }

    setActiveTab(next)
  }

  const handleGenerateOutline = async () => {
    if (!title || !essayType || !selectedTopic) {
      alert("Please fill in all required fields before generating an outline")
      return
    }

    setGeneratingOutline(true)

    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          essayType,
          topic: selectedTopic,
          wordCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate outline")
      }

      const data = await response.json()
      setOutline(data.outline)
    } catch (error) {
      console.error("Error generating outline:", error)
      alert("Failed to generate outline. Please try again.")
    } finally {
      setGeneratingOutline(false)
    }
  }

  const handleSaveEssay = () => {
    if (!title || !essayType || !selectedTopic) {
      alert("Please fill in all required fields before saving")
      return
    }

    const savedEssay = saveEssay({
      id: essayId || "",
      title,
      type: essayType,
      topic: selectedTopic,
      wordCount,
      outline,
      content: essay,
      lastEdited: new Date().toISOString(),
      status: essay.length > 100 ? "completed" : "draft",
      score: null,
    })

    setEssayId(savedEssay.id)
    alert("Essay saved successfully!")
    router.push("/essays")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Your Essay</h1>
            <p className="text-muted-foreground">Follow the step-by-step process to create a well-structured essay.</p>
          </div>
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="brainstorm" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Brainstorm</span>
            </TabsTrigger>
            <TabsTrigger value="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Outline</span>
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Write</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="brainstorm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Essay Details</CardTitle>
              <CardDescription>Provide basic information about your essay to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Essay Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your essay"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="essay-type">Essay Type</Label>
                <Select value={essayType} onValueChange={setEssayType}>
                  <SelectTrigger id="essay-type">
                    <SelectValue placeholder="Select essay type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="argumentative">Argumentative</SelectItem>
                    <SelectItem value="expository">Expository</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                    <SelectItem value="compare-contrast">Compare and Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="word-count">Target Word Count: {wordCount}</Label>
                </div>
                <Slider
                  id="word-count"
                  min={250}
                  max={2000}
                  step={50}
                  value={[wordCount]}
                  onValueChange={(value) => setWordCount(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>250</span>
                  <span>2000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update the TopicSuggestions component call to pass title instead of essayType */}
          <TopicSuggestions title={title} onSelectTopic={handleTopicSelect} selectedTopic={selectedTopic} />

          <div className="flex justify-end">
            <Button onClick={() => handleNextTab("brainstorm", "outline")}>Continue to Outline</Button>
          </div>
        </TabsContent>

        <TabsContent value="outline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Outline</CardTitle>
              <CardDescription>
                Structure your essay with a clear introduction, body paragraphs, and conclusion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{title || "Untitled Essay"}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{essayType || "No type selected"}</Badge>
                    <Badge variant="outline">{wordCount} words</Badge>
                    {selectedTopic && <Badge variant="outline">{selectedTopic}</Badge>}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleGenerateOutline}
                  disabled={generatingOutline}
                >
                  <Wand2 className={`h-4 w-4 ${generatingOutline ? "animate-spin" : ""}`} />
                  {generatingOutline ? "Generating..." : "Generate Outline"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outline">Essay Outline</Label>
                <Textarea
                  id="outline"
                  placeholder="Create your essay outline here..."
                  className="min-h-[300px] font-mono"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Tip: Structure your outline with clear sections for introduction, body paragraphs, and conclusion.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("brainstorm")}>
              Back to Brainstorm
            </Button>
            <Button onClick={() => handleNextTab("outline", "write")}>Continue to Writing</Button>
          </div>
        </TabsContent>

        <TabsContent value="write" className="space-y-6">
          <WritingEditor
            title={title}
            essayType={essayType}
            wordCount={wordCount}
            outline={outline}
            essay={essay}
            setEssay={setEssay}
            selectedTopic={selectedTopic}
          />

          {essay.length > 100 && <EssayGrading essay={essay} wordCount={wordCount} />}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("outline")}>
              Back to Outline
            </Button>
            <Button onClick={handleSaveEssay}>Save Essay</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
