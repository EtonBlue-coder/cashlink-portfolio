import React from "react";
import { TOKENS } from "../tokens.js";

export default function BillCard({ children, style }) {
  return (
    <div
      className="relative rounded-[14px] p-4"
      style={{
        background: TOKENS.paper,
        border: "1px solid rgba(47,93,80,0.18)",
        boxShadow: "0 1px 0 rgba(27,37,33,0.04)",
        ...style,
      }}
    >
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l" style={{ borderColor: TOKENS.gold }} />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r" style={{ borderColor: TOKENS.gold }} />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l" style={{ borderColor: TOKENS.gold }} />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r" style={{ borderColor: TOKENS.gold }} />
      {children}
    </div>
  );
}
