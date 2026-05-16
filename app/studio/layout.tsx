// The studio renders its own full-screen UI — no Navbar, Footer, or site chrome.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
