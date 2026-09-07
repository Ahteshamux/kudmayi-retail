import { ImageResponse } from "next/og";

export const alt = "Five sherwani mistakes every Pakistani groom should avoid";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#171410",
        color: "#f3ecdf",
        display: "flex",
        height: "100%",
        padding: "68px",
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
          padding: "52px 60px",
          width: "100%",
        }}
      >
        <div style={{ color: "#b8905a", display: "flex", fontSize: 23, letterSpacing: 7 }}>
          THE KUDMAYI JOURNAL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 66, lineHeight: 1.05 }}>
            5 Sherwani Mistakes Every Pakistani Groom Should Avoid
          </div>
          <div style={{ color: "#ded2bb", display: "flex", fontSize: 25 }}>
            Fit, fabric, colour, embroidery and the complete look.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
