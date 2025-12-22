"use client";
import { useState } from "react";

export default function CheckPage() {
  const [number, setNumber] = useState(localStorage.getItem("number"));
  return (
    <div>
      <h1>{number}</h1>
    </div>
  );
}
