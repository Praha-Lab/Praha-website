import { NextRequest, NextResponse } from "next/server";

const HIGGS_URL = process.env.HIGGS_TTS_URL || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text");
    const audio = formData.get("audio");
    const referenceText = formData.get("referenceText");

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 422 },
      );
    }

    if (!HIGGS_URL) {
      return NextResponse.json(
        { error: "Higgs TTS backend is not configured." },
        { status: 503 },
      );
    }

    const backendForm = new FormData();
    backendForm.set("text", text.trim());
    backendForm.set("temperature", "0.8");
    backendForm.set("top_k", "50");
    backendForm.set("max_new_tokens", "1024");

    if (referenceText && typeof referenceText === "string") {
      backendForm.set("reference_text", referenceText.trim());
    }

    if (audio && typeof audio !== "string") {
      const audioBytes = await (audio as File).arrayBuffer();
      backendForm.set("audio", new Blob([audioBytes]), (audio as File).name || "reference.wav");
    }

    console.log(`[higgs] text="${text.slice(0, 80)}…" audio=${audio && typeof audio !== "string" ? "yes" : "no"}`);

    const backendRes = await fetch(HIGGS_URL, {
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
      console.error(`[higgs] error: ${msg}`);
      return NextResponse.json({ error: msg }, { status: backendRes.status || 502 });
    }

    const audioBuffer = await backendRes.arrayBuffer();
    const backendTime = backendRes.headers.get("x-backend-time") || "";
    console.log(`[higgs] success: ${audioBuffer.byteLength}B audio backend=${backendTime || "n/a"}s`);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-cache",
        ...(backendTime ? { "X-Backend-Time": backendTime } : {}),
      },
    });
  } catch (e) {
    console.error(`[higgs] exception: ${(e as Error).message}`);
    return NextResponse.json(
      { error: `Higgs inference failed: ${(e as Error).message}` },
      { status: 500 },
    );
  }
}
