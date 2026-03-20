import TawkToChat from "@/components/TawkToChat";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TawkToChat />
    </>
  );
}
