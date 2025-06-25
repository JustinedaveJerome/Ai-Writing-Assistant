"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { getEssay, formatLastEdited } from "@/lib/essay-storage"

export default function EssayViewPage() {
  const params = useParams()
  const router = useRouter()
  const [essay, setEssay] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const essayData = getEssay(params.id as string)
      if (essayData) {
        setEssay(essayData)
      } else {
        // Essay not found, redirect to essays page
        router.push("/essays")
      }
    }
    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center">Loading essay...</div>
      </div>
    )
  }

  if (!essay) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center">Essay not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/essays"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Essays
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{essay.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{essay.type}</Badge>
            <Badge variant="outline">{essay.wordCount} words</Badge>
            <Badge variant={essay.status === "completed" ? "default" : "secondary"}>
              {essay.status === "completed" ? "Completed" : "Draft"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">Last edited {formatLastEdited(essay.lastEdited)}</p>
        </div>
        <Link href={`/write?id=${essay.id}`}>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Essay
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {essay.topic && (
          <Card>
            <CardHeader>
              <CardTitle>Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{essay.topic}</p>
            </CardContent>
          </Card>
        )}

        {essay.outline && (
          <Card>
            <CardHeader>
              <CardTitle>Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap font-mono">{essay.outline}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Essay Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap prose max-w-none">{essay.content}</div>
          </CardContent>
        </Card>

        {essay.score && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation</CardTitle>
              <CardDescription>AI-generated assessment of your essay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-5xl font-bold mb-2">{essay.score}/100</div>
                <div className="text-muted-foreground">Overall Score</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
