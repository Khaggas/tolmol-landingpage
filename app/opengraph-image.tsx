import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tolmol — Compare prices across every store";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(37,99,235,0.18), transparent 55%), radial-gradient(circle at 85% 20%, rgba(30,64,175,0.14), transparent 55%)",
          color: "#030712",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#030712",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.05em"
            }}
          >
            T
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Tolmol
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: 940
            }}
          >
            Compare prices across every store.
          </div>
          <div style={{ fontSize: 30, color: "#475569", maxWidth: 880, lineHeight: 1.35 }}>
            One search. Live prices in PKR. No tab-juggling.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#475569"
          }}
        >
          <div style={{ fontWeight: 600 }}>tolmol.pk</div>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 700
            }}
          >
            Join the waitlist
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
