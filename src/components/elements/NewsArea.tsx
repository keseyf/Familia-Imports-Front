import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export function NewsArea() {
  useEffect(() => {
    const sr = ScrollReveal();

    sr.reveal("#sg1", {
      duration: 800,
      distance: "50px",
      origin: "top",
      opacity: 0,
      reset: false,
    });

    sr.reveal("#sg2", {
      delay: 600,
      duration: 800,
      distance: "-50px",
      origin: "bottom",
      opacity: 0,
      reset: false,
    });
  }, []);

  return (
    <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <img
        src="./anuncio.png"
        alt=""
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/80">
        <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
          <h2
            id="sg1"
            className="max-w-2xl text-3xl font-black italic text-white md:text-5xl"
          >
            "NÃO É SÓ ROUPA. É{" "}
            <div className="text-rotate">
    <span>
      <ul className="gap-2 flex flex-col">
        <li>RESPEITO</li>
        <li>PRESENÇA</li>
        <li>ATITUDE</li>
        <li>IDENTIDADE</li>
      </ul>
    </span>
  </div>
            "
          </h2>

          <a
            href="#t1c"
            className="mt-5 animate-bounce rounded-xl bg-accent shadow-accent hover:shadow-2xl px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-accent-hover"
          >
            Descubra
          </a>
        </div>
      </div>
    </section>
  );
}