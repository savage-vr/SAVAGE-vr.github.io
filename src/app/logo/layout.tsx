// Nested layout: <html>, <body>, fonts, global CSS and the skip link come from
// the root layout (src/app/layout.tsx)
export default function LogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
