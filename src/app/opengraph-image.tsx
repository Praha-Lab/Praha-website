import { ImageResponse } from "next/og";

export const alt = "Praha Lab — Beyond Artificial. Toward Intelligence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f3f1eb",
        color: "#11120f",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: 52,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(17,18,15,.28)",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 54,
        }}
      >
        <div style={{ alignItems: "center", display: "flex", fontSize: 22, fontWeight: 700 }}>
          <span
            style={{
              background: "#9a241e",
              display: "flex",
              height: 15,
              marginRight: 16,
              width: 15,
            }}
          />
          PRAHA LAB
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#9a241e", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            APPLIED AI LABORATORY
          </span>
          <span style={{ fontSize: 112, fontWeight: 700, letterSpacing: 0, lineHeight: 0.88 }}>
            Praha Lab
          </span>
          <span style={{ color: "#6c6a61", fontSize: 30, fontWeight: 600, marginTop: 34 }}>
            Beyond Artificial. Toward Intelligence.
          </span>
        </div>
      </div>
    </div>,
    size,
  );
}
