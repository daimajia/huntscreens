import Header from "@/components/layout/header";

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}