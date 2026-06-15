import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
export default function ErrorNotification({ message }: { message: string }) {
  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal("#eNc", {
      duration: 500,
      origin: "right",
      distance: "20px",
    });
  }, []);

  return (
    <div id="eNc" className="fixed top-10 right-8 bg-red-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}