import { generateText } from "@/lib/ollama-client"

export async function POST(req: Request) {
  try {
    const { essay, evaluation } = await req.json()

    if (!essay || !evaluation) {
      return Response.json({ error: "Essay and evaluation are required" }, { status: 400 })
    }

    const prompt = `Based on this evaluation:
    ${JSON.stringify(evaluation)}
    
    For this essay:
    "${essay.substring(0, 1500)}..." ${essay.length > 1500 ? "(essay continues)" : ""}
    
    Create a detailed improvement plan with specific steps the writer should take to improve their essay.
    Include examples of how to implement each suggestion and prioritize the most important improvements.
    
    Format the response as a JSON object with an array of improvement steps, each with a title, description, and example.
    For example:
    {
      "steps": [
        {
          "title": "Strengthen Your Thesis",
          "description": "Your thesis needs to be more specific and clearly state your position.",
          "example": "Instead of 'Social media has many effects on society', try 'Instagram's emphasis on curated imagery has negatively impacted teenagers' self-esteem, as evidenced by rising anxiety rates'"
        },
        {
          "title": "Improve Paragraph Transitions",
          "description": "Add clear transitions between paragraphs to improve flow.",
          "example": "To connect paragraphs about economic and social impacts, add 'Beyond the economic consequences, the social implications are equally significant.'"
        }
      ]
    }
    
    Respond ONLY with the JSON object.`

    const text = await generateText({ prompt, temperature: 0.3 })

    // Parse the response as JSON
    let improvementPlan
    try {
      // Find JSON object in the response
      const jsonMatch = text.match(/{[\s\S]*}/m)
      if (jsonMatch) {
        improvementPlan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (e) {
      console.error("Error parsing improvement plan:", e)
      // If parsing fails, return a simple formatted plan
      improvementPlan = {
        steps: [
          {
            title: "Improvement Plan",
            description: text,
            example: "",
          },
        ],
      }
    }

    return Response.json(improvementPlan)
  } catch (error) {
    console.error("Error generating improvement plan:", error)
    return Response.json({ error: "Failed to generate improvement plan" }, { status: 500 })
  }
}
