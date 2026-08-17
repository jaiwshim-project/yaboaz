import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = `${origin}/og.png`;
  const description = "현장의 문제를 발견하고, 증거와 온톨로지로 구조화하며, AI Agent와 워크플로로 실행하는 K-FDE 운영 플랫폼입니다.";

  return {
    metadataBase: new URL(origin),
    title: { default: "K-FDE 현장 실행 플랫폼 | YABOAZ", template: "%s | K-FDE" },
    description,
    keywords: ["K-FDE", "현장 실행", "FDE", "온톨로지", "AI Agent", "워크플로", "문제해결", "현장 운영 플랫폼"],
    authors: [{ name: "YABOAZ K-FDE" }],
    creator: "YABOAZ K-FDE",
    publisher: "YABOAZ K-FDE",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg?v=2", apple: "/kfde-symbol.jpg?v=2" },
    openGraph: { type: "website", locale: "ko_KR", title: "K-FDE 현장 실행 플랫폼", description, url: origin, siteName: "YABOAZ K-FDE", images: [{ url: image, width: 1733, height: 909 }] },
    twitter: { card: "summary_large_image", title: "K-FDE 현장 실행 플랫폼", description, images: [image] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "현장의 문제를 발견하고 증거와 온톨로지로 구조화하며 AI Agent와 워크플로로 실행하는 K-FDE 운영 플랫폼";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${origin}/#organization`, name: "YABOAZ K-FDE", url: origin, logo: `${origin}/kfde-symbol.jpg` },
      { "@type": "WebSite", "@id": `${origin}/#website`, name: "K-FDE 현장 실행 플랫폼", url: origin, inLanguage: "ko-KR", publisher: { "@id": `${origin}/#organization` } },
      { "@type": "SoftwareApplication", name: "YABOAZ K-FDE Platform", applicationCategory: "BusinessApplication", operatingSystem: "Web", description, url: origin, image: `${origin}/og.png` }
    ]
  };
  return <html lang="ko"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}