import { FC } from "react";

export const AccessDeniedPage: FC = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 760,
        background: "rgba(15,22,41,.6)",
        backdropFilter: "saturate(120%) blur(6px)",
        border: "1px solid #22304f",
        borderRadius: 14,
        padding: 28,
        color: "#e6ecff",
        lineHeight: 1.65,
        fontSize: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div aria-hidden style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1px solid #2a3a5e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#a9b7d9",
            fontSize: 18,
          }}>⛔</div>
          <h1 style={{ margin: 0, fontSize: 24, letterSpacing: .2, fontWeight: 700, color: "#ffffff" }}>Access denied</h1>
        </div>
        
        <div style={{ margin: "8px 0 0", fontSize: 15, color: "#c7d3f0" }}>
          Unsupported browser. Required features are unavailable.
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 600, color: "#dbe6ff", marginBottom: 8 }}>Recommended action</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#c7d3f0" }}>
            <li>Switch to Opera or Firefox.</li>
            <li>Or follow the recommendation from the chat.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


