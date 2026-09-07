import { ImageResponse } from "next/og";

export const alt = "Walima groom outfits compared: sherwani, prince coat or suit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#171410", color: "#f3ecdf", display: "flex", height: "100%", padding: "68px", width: "100%" }}>
      <div style={{ border: "2px solid #b8905a", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "52px 60px", width: "100%" }}>
        <div style={{ color: "#b8905a", display: "flex", fontSize: 23, letterSpacing: 7 }}>THE KUDMAYI JOURNAL</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 66, lineHeight: 1.05 }}>Walima Groom Outfits</div>
          <div style={{ color: "#ded2bb", display: "flex", fontSize: 29 }}>Sherwani, prince coat or suit?</div>
        </div>
      </div>
    </div>,
    size,
  );
}
