import Footer from "@/components/layout/footer";
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
      <Footer className="max-w-7xl mx-auto"/>
    </>
  );
}