import { ImageResponse } from "next/og";

export const alt = "Seven Nikah dress ideas for Pakistani grooms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#f3ecdf", color: "#171410", display: "flex", height: "100%", padding: "68px", width: "100%" }}>
      <div style={{ border: "2px solid #b8905a", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "52px 60px", width: "100%" }}>
        <div style={{ color: "#8a6534", display: "flex", fontSize: 23, letterSpacing: 7 }}>THE KUDMAYI JOURNAL</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 66, lineHeight: 1.05 }}>7 Best Nikah Dress Ideas</div>
          <div style={{ color: "#6f6250", display: "flex", fontSize: 29 }}>For Pakistani grooms</div>
        </div>
      </div>
    </div>,
    size,
  );
}
