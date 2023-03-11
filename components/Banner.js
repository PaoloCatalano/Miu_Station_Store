import React from "react";

export default function Banner({ text, role = "" }) {
  const roleStyle = role === "alert" ? `bg-red-400` : `bg-miu-300`;

  return (
    <div className={`p-2 rounded animate-fade-in ${roleStyle}`} role={role}>
      <div className="text-center">
        <h4>{text}</h4>
      </div>
    </div>
  );
}
