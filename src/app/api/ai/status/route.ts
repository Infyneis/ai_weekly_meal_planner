import { NextResponse } from "next/server";
import { checkOllamaStatus } from "@/lib/ollama";

// GET /api/ai/status - Check if Ollama is running and model is available
export async function GET() {
  try {
    const status = await checkOllamaStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error checking AI status:", error);
    return NextResponse.json({
      running: false,
      modelAvailable: false,
      error: "Failed to check AI status",
    });
  }
}
