import { NextRequest, NextResponse } from "next/server";

const RIMATTS_URL = process.env.PRAHA_TTS_URL ?? "";
const MAX_TEXT_LENGTH = 1000;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 120_000;
const AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text");
    const audio = formData.get("audio");

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 422 });
    }

    if (text.trim().length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.` },
        { status: 413 },
      );
    }

    if (!(audio instanceof File)) {
      return NextResponse.json(
        { error: "A reference audio file is required." },
        { status: 422 },
      );
    }

    if (audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Reference audio must be a non-empty file no larger than 10 MB." },
        { status: 413 },
      );
    }

    if (audio.type && !AUDIO_TYPES.has(audio.type)) {
      return NextResponse.json(
        { error: "Reference audio must be a WAV or MP3 file." },
        { status: 415 },
      );
    }

    if (!RIMATTS_URL) {
      return NextResponse.json(
        { error: "RimaTTS inference is temporarily unavailable." },
        { status: 503 },
      );
    }

    const backendForm = new FormData();
    backendForm.set("text", text.trim());
    backendForm.set("audio", audio, audio.name || "reference.wav");

    const backendResponse = await fetch(RIMATTS_URL, {
      method: "POST",
      body: backendForm,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const contentType = backendResponse.headers.get("content-type") ?? "";
    if (!backendResponse.ok || contentType.includes("application/json")) {
      console.error("[rimats] backend request failed", {
        status: backendResponse.status,
        contentType,
      });
      return NextResponse.json(
        { error: "RimaTTS could not generate audio. Please try again." },
        { status: backendResponse.status >= 500 ? 502 : backendResponse.status },
      );
    }

    if (!contentType.startsWith("audio/")) {
      console.error("[rimats] unexpected backend response", { contentType });
      return NextResponse.json(
        { error: "RimaTTS returned an invalid audio response." },
        { status: 502 },
      );
    }

    const audioBuffer = await backendResponse.arrayBuffer();
    if (audioBuffer.byteLength < 500) {
      return NextResponse.json(
        { error: "RimaTTS returned incomplete audio. Please try again." },
        { status: 502 },
      );
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'inline; filename="rimats-v1.wav"',
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error("[rimats] inference request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        error: timedOut
          ? "RimaTTS took too long to respond. Please try again."
          : "RimaTTS inference is temporarily unavailable.",
      },
      { status: timedOut ? 504 : 500 },
    );
  }
}
