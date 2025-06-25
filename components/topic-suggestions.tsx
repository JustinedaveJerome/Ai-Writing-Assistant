"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TopicSuggestionsProps {
  title: string
  onSelectTopic: (topic: string) => void
  selectedTopic: string
}

export default function TopicSuggestions({ title, onSelectTopic, selectedTopic }: TopicSuggestionsProps) {
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTopics = async () => {
    if (!title) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/topic-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch topic suggestions")
      }

      const data = await response.json()
      setTopics(data.topics || [])
    } catch (err) {
      console.error("Error fetching topics:", err)
      setError("Failed to generate topic suggestions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (title) {
      fetchTopics()
    } else {
      setTopics([])
    }
  }, [title])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Topic Suggestions</CardTitle>
          <CardDescription>
            {title
              ? `Select a topic for your essay "${title}" or create your own.`
              : "Enter an essay title to see topic suggestions."}
          </CardDescription>
        </div>
        {title && (
          <Button variant="outline" size="icon" onClick={fetchTopics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!title ? (
          <div className="text-center py-6 text-muted-foreground">
            Please enter an essay title to see topic suggestions.
          </div>
        ) : loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : topics.length > 0 ? (
          <div className="grid gap-2">
            {topics.map((topic, index) => (
              <Button
                key={index}
                variant={selectedTopic === topic ? "default" : "outline"}
                className="justify-start h-auto py-3 px-4 text-left"
                onClick={() => onSelectTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No topics available for this essay title.</div>
        )}
      </CardContent>
    </Card>
  )
}
