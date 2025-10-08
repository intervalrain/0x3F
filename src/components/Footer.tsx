import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "4px",
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        fontSize: "14px",
        color: "#6b7280",
      }}
    >
      <div>
        © {new Date().getFullYear()} Rain Hu. 版權沒有{" ("}
        <a
          href="https://github.com/intervalrain/0x3F"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          source code
        </a>{") "}
        隨喜星星 & 題單來源自
        <a
          href="https://github.com/EndlessCheng"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          靈茶山艾府
        </a>
      </div>
    </footer>
  );
};

export default Footer;
