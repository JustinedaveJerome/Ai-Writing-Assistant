import { generateText } from "@/lib/ollama-client"

export async function POST(req: Request) {
  try {
    const { title, essayType, topic, wordCount } = await req.json()

    if (!title || !essayType || !topic) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = `Create a detailed outline for a ${wordCount}-word ${essayType} essay titled "${title}" on the topic "${topic}".
    Include an introduction, body paragraphs with main points, and a conclusion.
    Format the outline with clear sections and bullet points.
    
    Example format:
    I. Introduction
       - Hook/attention grabber
       - Background information
       - Thesis statement
    
    II. First Main Point
       - Supporting evidence
       - Example
       - Analysis
    
    III. Second Main Point
       - Supporting evidence
       - Example
       - Analysis
    
    IV. Conclusion
       - Restate thesis
       - Summarize main points
       - Closing thought
    `

    const outline = await generateText({ prompt })

    return Response.json({ outline })
  } catch (error) {
    console.error("Error generating outline:", error)
    return Response.json({ error: "Failed to generate outline" }, { status: 500 })
  }
}
