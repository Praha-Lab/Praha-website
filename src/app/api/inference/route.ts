import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "not_ready",
      message: "Inference is scaffolded but no public model is released yet.",
    },
    { status: 501 },
  );
}
