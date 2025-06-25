import { Ollama } from "langchain/llms/ollama"

// Cache the Ollama client to avoid creating a new instance for each request
let ollamaClient: Ollama | null = null

export function getOllamaClient() {
  if (!ollamaClient) {
    ollamaClient = new Ollama({
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      model: "mistral",
      temperature: 0.7,
    })
  }
  return ollamaClient
}

interface GenerateTextParams {
  prompt: string
  temperature?: number
  maxTokens?: number
}

export async function generateText(params: GenerateTextParams): Promise<string> {
  const { prompt, temperature = 0.7, maxTokens = 2048 } = params

  const ollama = getOllamaClient()
  ollama.temperature = temperature
  ollama.maxTokens = maxTokens

  const result = await ollama.call(prompt)
  return result
}
