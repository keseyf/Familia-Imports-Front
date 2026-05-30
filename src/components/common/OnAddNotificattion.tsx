import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export default function OnAddNottification({ message }: { message: string }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Aqui você pode adicionar lógica para remover a notificação após um tempo
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        ScrollReveal().reveal('#sNc', { delay: 200, distance: '20px', duration: 500, origin: 'top' });
    }, []);

  return (
    <div id="sNc" className="fixed text-xl text-center top-30 right-7 bg-green-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}