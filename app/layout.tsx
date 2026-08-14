import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const description = "현장 문제를 증거와 온톨로지로 구조화하고 실행과 성과로 연결하는 FDE 운영 플랫폼";

  return {
    title: "K-FDE Field Operating System",
    description,
    openGraph: { title: "K-FDE — 현장을 실행으로.", description, images: [{ url: image, width: 1733, height: 909 }] },
    twitter: { card: "summary_large_image", title: "K-FDE — 현장을 실행으로.", description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
