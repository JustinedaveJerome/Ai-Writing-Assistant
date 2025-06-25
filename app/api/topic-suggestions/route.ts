import { generateText } from "@/lib/ollama-client"

export async function POST(req: Request) {
  try {
    const { title } = await req.json()

    if (!title) {
      return Response.json({ error: "Essay title is required" }, { status: 400 })
    }

    const prompt = `Generate 5 interesting and educational topic suggestions for an essay titled "${title}".
    Format the response as a JSON array of strings.
    Each topic should be thought-provoking and suitable for academic writing.
    The topics should be related to the title but provide specific angles or perspectives to explore.
    
    Example response format:
    ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
    
    Only respond with the JSON array and nothing else.`

    const text = await generateText({ prompt })

    // Parse the response as JSON
    let topics
    try {
      // Find everything between square brackets
      const jsonMatch = text.match(/\[.*?\]/s)
      if (jsonMatch) {
        topics = JSON.parse(jsonMatch[0])
      } else {
        // If no proper JSON is found, extract topics using regex
        const topicMatches = text.match(/"([^"]+)"/g)
        topics = topicMatches ? topicMatches.map((match) => match.replace(/"/g, "")) : []
      }
    } catch (e) {
      console.error("Error parsing topics:", e)
      // If parsing fails, extract topics using regex as fallback
      const topicMatches = text.match(/"([^"]+)"/g)
      topics = topicMatches ? topicMatches.map((match) => match.replace(/"/g, "")) : []
    }

    return Response.json({ topics: Array.isArray(topics) ? topics : [] })
  } catch (error) {
    console.error("Error generating topics:", error)
    return Response.json({ error: "Failed to generate topics" }, { status: 500 })
  }
}
