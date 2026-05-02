import { ImageResponse } from "next/og";

export const alt =
  "His Grace Most Rev. Valerian M. Okeke — Metropolitan Archbishop of Onitsha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F7F4EE",
          padding: "72px 96px",
          color: "#0A1B33",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 64,
              height: 1.5,
              backgroundColor: "#B08840",
            }}
          />
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#B08840",
            }}
          >
            His Grace
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 96,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            <span>Most Rev.&nbsp;</span>
            <span style={{ fontStyle: "italic", color: "#B08840" }}>
              Valerian&nbsp;
            </span>
            <span>M. Okeke</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              fontStyle: "italic",
              color: "#1F3354",
              lineHeight: 1.4,
            }}
          >
            Metropolitan Archbishop of Onitsha
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: "1px solid rgba(176,136,64,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#1F3354",
            }}
          >
            Pastoral Letters · Homilies · Reflections
          </span>
          <span
            style={{
              fontStyle: "italic",
              fontSize: 26,
              color: "#B08840",
            }}
          >
            Ut Vitam Habeant
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
