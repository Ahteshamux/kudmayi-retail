import { ImageResponse } from "next/og";

export const alt = "The Kudmayi Journal, notes on Pakistani groomwear and style";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f3ecdf",
        color: "#171410",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #b8905a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 64px",
          width: "100%",
        }}
      >
        <div style={{ color: "#8a6534", display: "flex", fontSize: 24, letterSpacing: 7 }}>
          KUDMAYI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 76 }}>
            The Kudmayi Journal
          </div>
          <div style={{ color: "#6f6250", display: "flex", fontSize: 28 }}>
            Notes on dressing well.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
