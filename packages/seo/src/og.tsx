import * as React from "react";

export type OgTemplateProps = {
  title: string;
  subtitle?: string;
  kind?: "page" | "blog" | "service" | "job";
};

export function OgTemplate({ title, subtitle, kind = "page" }: OgTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "linear-gradient(135deg, #142C1E 0%, #2D5A3D 100%)",
        color: "#F5F1E8",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: 4, textTransform: "uppercase" }}>
        Rootline Technology · {kind}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 400 }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 32, opacity: 0.8 }}>{subtitle}</div> : null}
      </div>
      <div style={{ fontSize: 24, opacity: 0.6 }}>rootline.tech</div>
    </div>
  );
}
