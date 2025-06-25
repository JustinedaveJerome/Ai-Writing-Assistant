// Simple client-side storage for essays
// In a real application, this would use a database

export interface Essay {
  id: string
  title: string
  type: string
  topic: string
  wordCount: number
  outline: string
  content: string
  lastEdited: string
  score?: number | null
  evaluation?: any
  status: "draft" | "completed"
}

// Get all saved essays
export function getEssays(): Essay[] {
  if (typeof window === "undefined") return []

  const essays = localStorage.getItem("essays")
  return essays ? JSON.parse(essays) : []
}

// Save a new essay or update an existing one
export function saveEssay(essay: Essay): Essay {
  if (typeof window === "undefined") return essay

  const essays = getEssays()

  // If essay has no ID, generate one
  if (!essay.id) {
    essay.id = Date.now().toString()
    essay.lastEdited = new Date().toISOString()
  } else {
    // Update lastEdited for existing essays
    essay.lastEdited = new Date().toISOString()

    // Remove the old version if it exists
    const index = essays.findIndex((e) => e.id === essay.id)
    if (index !== -1) {
      essays.splice(index, 1)
    }
  }

  // Add the new/updated essay
  essays.push(essay)

  // Save to localStorage
  localStorage.setItem("essays", JSON.stringify(essays))

  return essay
}

// Get a specific essay by ID
export function getEssay(id: string): Essay | null {
  if (typeof window === "undefined") return null

  const essays = getEssays()
  return essays.find((essay) => essay.id === id) || null
}

// Delete an essay
export function deleteEssay(id: string): boolean {
  if (typeof window === "undefined") return false

  const essays = getEssays()
  const filteredEssays = essays.filter((essay) => essay.id !== id)

  if (filteredEssays.length === essays.length) {
    return false // Essay not found
  }

  localStorage.setItem("essays", JSON.stringify(filteredEssays))
  return true
}

// Format the "last edited" date for display
export function formatLastEdited(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`

  return date.toLocaleDateString()
}
