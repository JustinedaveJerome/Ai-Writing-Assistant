import { generateText } from "@/lib/ollama-client"

export async function POST(req: Request) {
  try {
    const { essay, essayType, wordCount } = await req.json()

    if (!essay) {
      return Response.json({ error: "Essay content is required" }, { status: 400 })
    }

    const prompt = `Evaluate this ${essayType || ""} essay (target length: ${wordCount || "500"} words):
    
    "${essay}"
    
    Provide a detailed evaluation in JSON format with the following structure:
    {
      "overallScore": (number between 0-100),
      "criteria": [
        {
          "name": "Grammar & Syntax",
          "score": (number between 0-100),
          "feedback": (detailed feedback on grammar and syntax),
          "suggestions": [(array of 3 specific improvement suggestions)]
        },
        {
          "name": "Coherence & Structure",
          "score": (number between 0-100),
          "feedback": (detailed feedback on coherence and structure),
          "suggestions": [(array of 3 specific improvement suggestions)]
        },
        {
          "name": "Argument Strength",
          "score": (number between 0-100),
          "feedback": (detailed feedback on argument strength and evidence),
          "suggestions": [(array of 3 specific improvement suggestions)]
        }
      ]
    }
    
    Make sure to respond with ONLY the JSON object and nothing else.`

    const text = await generateText({ prompt, temperature: 0.2 })

    // Parse the response as JSON
    let evaluation
    try {
      // Find JSON object in the response
      const jsonMatch = text.match(/{[\s\S]*}/m)
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (e) {
      console.error("Error parsing evaluation:", e)
      // Return a fallback evaluation
      evaluation = {
        overallScore: 75,
        criteria: [
          {
            name: "Grammar & Syntax",
            score: 75,
            feedback: "The essay contains some grammatical errors that could be improved.",
            suggestions: [
              "Review your use of punctuation throughout the essay.",
              "Check for consistent tense usage throughout your paragraphs.",
              "Consider using more varied sentence structures to improve readability.",
            ],
          },
          {
            name: "Coherence & Structure",
            score: 75,
            feedback: "The essay has a generally clear structure but connections between ideas could be stronger.",
            suggestions: [
              "Add more transition phrases between paragraphs.",
              "Ensure each paragraph focuses on a single main idea.",
              "Consider a stronger introduction that clearly states your thesis.",
            ],
          },
          {
            name: "Argument Strength",
            score: 75,
            feedback: "Your arguments could be more compelling with stronger evidence.",
            suggestions: [
              "Include more specific examples to support your main points.",
              "Address potential counterarguments to strengthen your position.",
              "Develop your conclusion to more clearly tie back to your thesis.",
            ],
          },
        ],
      }
    }

    return Response.json(evaluation)
  } catch (error) {
    console.error("Error evaluating essay:", error)
    return Response.json({ error: "Failed to evaluate essay" }, { status: 500 })
  }
}
