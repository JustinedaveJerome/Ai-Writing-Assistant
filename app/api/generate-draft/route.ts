import { generateText } from "@/lib/ollama-client"

export async function POST(req: Request) {
  try {
    const { title, essayType, topic, outline, wordCount } = await req.json()

    if (!title || !essayType || !topic || !outline) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = `Write a ${wordCount}-word ${essayType} essay titled "${title}" on the topic "${topic}".
    Follow this outline:
    ${outline}
    
    The essay should be well-structured, engaging, and appropriate for academic submission.
    Aim for approximately ${wordCount} words.
    Use proper grammar, paragraph structure, and transitions between ideas.`

    const draft = await generateText({
      prompt,
      temperature: 0.6,
      maxTokens: Math.max(2048, Math.min(8192, wordCount * 4)), // Adjust token count based on word count
    })

    return Response.json({ draft })
  } catch (error) {
    console.error("Error generating draft:", error)
    return Response.json({ error: "Failed to generate draft" }, { status: 500 })
  }
}
