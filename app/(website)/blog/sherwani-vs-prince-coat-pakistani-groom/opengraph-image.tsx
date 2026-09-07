import { ImageResponse } from "next/og";

export const alt = "Sherwani versus prince coat for a Pakistani groom";
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
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 70, lineHeight: 1.05 }}>
            Sherwani vs Prince Coat
          </div>
          <div style={{ color: "#ded2bb", display: "flex", fontSize: 29 }}>
            What should a Pakistani groom wear?
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
