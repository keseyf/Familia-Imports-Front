import { useEffect, useState, useRef } from "react"
import { BiMenu, BiX } from "react-icons/bi"
import ScrollReveal from "scrollreveal"

const navLinks = [
  { label: "Conjuntos Masculinos", href: "#conjuntoM" },
  { label: "Conjuntos Femininos", href: "#conjuntoF" },
  { label: "Camisetas", href: "#camisetas" },
  { label: "Bobojaco",  href: "#bobojaco" },
  { label: "Moletom",   href: "#moletom" },
  { label: "Jaquetas",  href: "#jaqueta" },
  { label: "Calças",    href: "#calcas" },
  { label: "Shorts",    href: "#short" },
  { label: "Tênis",     href: "#tenis" },
  { label: "Acessórios",href: "#acessorios" },
]

export default function Header() {
  const [isFixed, setIsFixed]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    ScrollReveal().reveal("#header-static", {
      origin: "top", delay: 200, distance: "40px", duration: 1000,
    })
  }, [])

  useEffect(() => {
    function handleScroll() {
      if (!headerRef.current) return
      setIsFixed(headerRef.current.getBoundingClientRect().bottom <= 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) setMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const mobileMenu = (isLight: boolean) => (
    <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
      mobileOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
    }`}>
      <ul className={`flex flex-col gap-1 pb-2 border-t pt-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
        {navLinks.map((link, i) => (
          <li
            key={link.href}
            style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
            className={`transition-all duration-300 ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
          >
            <a
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isLight
                  ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`} />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )

  const hamburger = (isLight: boolean) => (
    <button
      className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
        isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-200 hover:bg-white/10"
      }`}
      onClick={() => setMobileOpen(v => !v)}
      aria-label="Menu"
    >
      <span className={`block transition-all duration-300 ${mobileOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"}`}>
        <BiMenu className="text-2xl" />
      </span>
      <span className={`block transition-all duration-300 ${mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"}`}>
        <BiX className="text-2xl" />
      </span>
    </button>
  )

  return (
    <>
      {/* Header estático — sempre no fluxo, sem layout shift */}
      <header id="header-static" ref={headerRef} className="w-full relative z-10">
        <div className="bg-primary px-8 p-5 text-gray-200 border border-black/30 shadow-3xl shadow-black/50 backdrop-blur-md">
          <nav className="flex items-center w-full justify-between px-2">
            <a href="/#" className="hover:scale-90 duration-200">
              <img className="w-42" src="./logodefinitiva23.png" alt="Logo" />
            </a>
            <ul className="lg:flex hidden flex-wrap justify-center font-medium gap-6 items-center">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-200 hover:text-white duration-200 transition-all">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {hamburger(false)}
          </nav>
          {mobileMenu(false)}
        </div>
      </header>

      {/* Header fixo — desliza ao entrar/sair */}
      <header className={`fixed top-3 px-3 w-full z-50 transition-all duration-300 ease-out ${
        isFixed
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-3 opacity-0 pointer-events-none"
      }`}>
        <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-black/10 shadow-xl p-4">
          <nav className="flex items-center w-full justify-between px-2">
            <a href="/#" className="hover:scale-90 duration-200">
              <img className="w-42" src="./logodefinitiva.png" alt="Logo" />
            </a>
            <ul className="lg:flex hidden flex-wrap justify-center font-medium gap-5 items-center">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-xs text-gray-500 hover:text-gray-900 duration-200 transition-all">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {hamburger(true)}
          </nav>
          {mobileMenu(true)}
        </div>
      </header>
    </>
  )
}