import { ImageResponse } from "next/og";

export const alt =
  "Ariela Israel, software developer and Health Services Management student transitioning into health information and informatics";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 20% 38%, rgba(255, 145, 184, 0.5), transparent 34%), radial-gradient(circle at 84% 22%, rgba(36, 199, 201, 0.18), transparent 30%), linear-gradient(135deg, #FFF7FA 0%, #FFECEA 52%, #FFFDF8 100%)",
        color: "#351827",
        fontFamily: "'Plus Jakarta Sans', 'Nunito Sans', Arial, sans-serif",
      }}
    >
      <svg
        aria-hidden="true"
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
        }}
      >
        <g fill="none" stroke="#C42B70" strokeWidth="2" strokeOpacity="0.34">
          <path d="M30 130 L145 65 L250 145 L360 78 L475 155" />
          <path d="M760 100 L850 54 L955 132 L1060 72 L1170 148" />
          <path d="M42 500 L160 430 L275 520 L385 448 L500 532" />
          <path d="M720 510 L835 430 L940 520 L1060 444 L1180 518" />
        </g>

        <g fill="#C42B70" fillOpacity="0.5">
          <circle cx="30" cy="130" r="6" />
          <circle cx="145" cy="65" r="6" />
          <circle cx="250" cy="145" r="6" />
          <circle cx="360" cy="78" r="6" />
          <circle cx="475" cy="155" r="6" />

          <circle cx="760" cy="100" r="6" />
          <circle cx="850" cy="54" r="6" />
          <circle cx="955" cy="132" r="6" />
          <circle cx="1060" cy="72" r="6" />
          <circle cx="1170" cy="148" r="6" />
        </g>

        <g fill="#24C7C9" fillOpacity="0.65">
          <circle cx="42" cy="500" r="6" />
          <circle cx="160" cy="430" r="6" />
          <circle cx="275" cy="520" r="6" />
          <circle cx="385" cy="448" r="6" />
          <circle cx="500" cy="532" r="6" />

          <circle cx="720" cy="510" r="6" />
          <circle cx="835" cy="430" r="6" />
          <circle cx="940" cy="520" r="6" />
          <circle cx="1060" cy="444" r="6" />
          <circle cx="1180" cy="518" r="6" />
        </g>
      </svg>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          margin: "46px",
          padding: "64px 72px",
          border: "2px solid rgba(196, 43, 112, 0.2)",
          borderRadius: "38px",
          background: "rgba(255, 253, 248, 0.88)",
          boxShadow: "0 30px 80px rgba(196, 43, 112, 0.16)",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#C42B70",
            fontSize: "19px",
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          Software · Health Information · Informatics
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "24px",
            maxWidth: "930px",
            fontSize: "66px",
            lineHeight: 1.04,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          Where software systems meet health information.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "24px",
            maxWidth: "920px",
            color: "#6B4E57",
            fontSize: "27px",
            lineHeight: 1.35,
            fontWeight: 600,
          }}
        >
          Software developer and Health Services Management student bringing a systems-and-data
          foundation into healthcare.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "42px",
            paddingTop: "24px",
            borderTop: "2px solid rgba(196, 43, 112, 0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#C42B70",
              fontSize: "25px",
              fontWeight: 700,
              letterSpacing: "0.16em",
            }}
          >
            ariela israel
          </div>

          <div
            style={{
              display: "flex",
              color: "#351827",
              fontSize: "19px",
              fontWeight: 600,
            }}
          >
            Women&apos;s Health Equity Advocate &amp; Informatician in progress
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
