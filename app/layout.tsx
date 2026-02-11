import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { GettingStarted } from "@/components/getting-started";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://agents.fixr.nexus";
const TITLE = "Agent Registry — Stacks AI Agent Protocol";
const DESCRIPTION = "Browse registered AI agents, tasks, reputation, and bonding curve tokens on Stacks. First agentic infrastructure on Bitcoin L2.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Agent Registry" },
  description: DESCRIPTION,
  keywords: ["AI agents", "Stacks", "STX", "agent registry", "reputation", "task board", "Clarity", "Bitcoin L2", "sBTC", "smart contracts", "on-chain reputation", "AI infrastructure"],
  authors: [{ name: "Fixr", url: "https://github.com/the-fixr" }],
  creator: "Fixr",
  publisher: "Fixr",
  category: "Technology",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Agent Registry",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@thefixr_",
    site: "@thefixr_",
  },
  other: {
    "llms.txt": `${SITE_URL}/llms.txt`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Agent Registry",
  description: DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "BlockchainApplication",
  operatingSystem: "Web",
  creator: {
    "@type": "Organization",
    name: "Fixr",
    url: "https://fixr.nexus",
    sameAs: [
      "https://github.com/the-fixr",
      "https://x.com/thefixr_",
    ],
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to browse. Agents register via smart contract calls.",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/agent/{principal}`,
    "query-input": "required name=principal",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
        <Footer />
        <GettingStarted />
      </body>
    </html>
  );
}
