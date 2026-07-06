import { NextRequest, NextResponse } from "next/server";

const OMNIVOICE_URL = process.env.OMNIVOICE_TTS_URL || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text");
    const audio = formData.get("audio");
    const referenceText = formData.get("referenceText");

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 422 });
    }

    if (!audio || typeof audio === "string") {
      return NextResponse.json(
        { error: "Reference audio is required." },
        { status: 422 },
      );
    }

    if (!referenceText || typeof referenceText !== "string" || !referenceText.trim()) {
      return NextResponse.json(
        { error: "Reference transcript is required." },
        { status: 422 },
      );
    }

    if (!OMNIVOICE_URL) {
      return NextResponse.json(
        { error: "OmniVoice backend is not configured." },
        { status: 503 },
      );
    }

    const audioBytes = await (audio as File).arrayBuffer();
    const backendForm = new FormData();
    backendForm.set("text", text.trim());
    backendForm.set("reference_text", referenceText.trim());
    backendForm.set("audio", new Blob([audioBytes]), (audio as File).name || "reference.wav");

    console.log(`[omnivoice] text="${text.slice(0, 80)}…" audio=${audioBytes.byteLength}B`);

    const backendRes = await fetch(OMNIVOICE_URL, {
      method: "POST",
      body: backendForm,
    });

    const contentType = backendRes.headers.get("content-type") || "";

    if (!backendRes.ok || contentType.includes("application/json")) {
      let msg = `Backend returned ${backendRes.status}`;
      try {
        const body = await backendRes.json();
        msg = body.error || body.detail?.[0]?.msg || msg;
      } catch {
        msg = (await backendRes.text().catch(() => msg)) || msg;
      }
      console.error(`[omnivoice] error: ${msg}`);
      return NextResponse.json({ error: msg }, { status: backendRes.status || 502 });
    }

    const audioBuffer = await backendRes.arrayBuffer();
    const backendTime = backendRes.headers.get("x-backend-time") || "";
    console.log(`[omnivoice] success: ${audioBuffer.byteLength}B audio backend=${backendTime || "n/a"}s`);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-cache",
        ...(backendTime ? { "X-Backend-Time": backendTime } : {}),
      },
    });
  } catch (e) {
    console.error(`[omnivoice] exception: ${(e as Error).message}`);
    return NextResponse.json(
      { error: `OmniVoice inference failed: ${(e as Error).message}` },
      { status: 500 },
    );
  }
}
