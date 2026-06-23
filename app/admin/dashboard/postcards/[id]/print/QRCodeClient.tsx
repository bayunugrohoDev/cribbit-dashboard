"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeClient({ value, size }: { value: string; size: number }) {
  return <QRCodeSVG value={value} size={size} />;
}
