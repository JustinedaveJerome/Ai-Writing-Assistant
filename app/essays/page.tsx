"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { getEssays, deleteEssay, formatLastEdited } from "@/lib/essay-storage"
import { useRouter } from "next/navigation"

export default function EssaysPage() {
  const [essays, setEssays] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load essays from storage
    setEssays(getEssays())
  }, [])

  const handleDeleteEssay = (id: string) => {
    if (confirm("Are you sure you want to delete this essay?")) {
      deleteEssay(id)
      setEssays(getEssays())
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Essays</h1>
          <p className="text-muted-foreground">View and manage your essays.</p>
        </div>
        <Link href="/write">
          <Button>Create New Essay</Button>
        </Link>
      </div>

      {essays.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-xl font-medium mb-2">No Essays Yet</h3>
          <p className="text-muted-foreground mb-6">You haven't created any essays yet.</p>
          <Link href="/write">
            <Button>Create Your First Essay</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {essays.map((essay) => (
            <Card key={essay.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{essay.title}</CardTitle>
                    <CardDescription>Last edited {formatLastEdited(essay.lastEdited)}</CardDescription>
                  </div>
                  {essay.score && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      Score: {essay.score}/100
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{essay.type}</Badge>
                  <Badge variant="outline">{essay.wordCount} words</Badge>
                  <Badge variant={essay.status === "completed" ? "default" : "secondary"}>
                    {essay.status === "completed" ? "Completed" : "Draft"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleDeleteEssay(essay.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Link href={`/essays/${essay.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Link href={`/write?id=${essay.id}`}>
                  <Button size="sm" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
