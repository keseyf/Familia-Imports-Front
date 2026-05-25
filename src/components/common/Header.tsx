import { useEffect, useState } from "react"
import { BiMenu, BiX } from "react-icons/bi"
import ScrollReveal from "scrollreveal"

const navLinks = [
  { label: "Camisas", href: "#camisas" },
  { label: "Calças", href: "#calcas" },
  { label: "Conjuntos", href: "#conjuntos" },
  { label: "Tênis", href: "#tenis" },
  { label: "Bonés", href: "#bones" },
]

export default function Header() {
  const [isSmall, setIsSmall] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 78) {
        setIsSmall(true)
      } else {
        setIsSmall(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    ScrollReveal().reveal("#header", {
      origin: "top",
      delay: 200,
      distance: "40px",
      duration: 1000,
    })
  }, [])

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) setMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header
      id="header"
      className={`w-full duration-300 sticky ${isSmall ? "top-3 px-3" : "top-0"} z-50`}
    >
      <div
        className={`w-full border border-black/30 duration-300 shadow-3xl shadow-black/50 backdrop-blur-md overflow-hidden
          ${isSmall ? "bg-white/85 rounded-2xl p-4" : "bg-primary px-8 p-5 text-gray-200"}
        `}
      >
        {/* Main row */}
        <nav
          className={`flex items-center w-full justify-between transition-all duration-300 px-2 ease-in-out ${isSmall ? "scale-95 opacity-90" : "scale-100"
            }`}
        >
          {/* Logo */}
          <a href="/#" className="hover:scale-90 duration-200">
            {isSmall ? (
              <img className="w-42" src="./logodefinitiva.png" alt="" />
            ) : (
              <img className="w-42" src="./logodefinitiva23.png" alt="" />
            )}
          </a>

          {/* Desktop nav */}
          <ul className="lg:flex hidden flex-wrap text-center justify-center relative font-medium lg:gap-10 gap-5 text-sm items-center lg:w-fit w-full lg:text-base">
            {navLinks.map(link => (
              <li key={link.href}>
                <a id="ho" href={link.href} className="relative duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${isSmall
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-200 hover:bg-white/10"
              }`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            <span
              className={`block transition-all duration-300 ${mobileOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"
                }`}
            >
              <BiMenu className="text-2xl" />
            </span>
            <span
              className={`block transition-all duration-300 ${mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"
                }`}
            >
              <BiX className="text-2xl" />
            </span>
          </button>
        </nav>

        {/* Mobile menu — animado com max-height */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${mobileOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <ul
            className={`flex flex-col gap-1 pb-2 border-t pt-3 ${isSmall ? "border-gray-200" : "border-white/10"
              }`}
          >
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                }}
                className={`transition-all duration-300 ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
              >
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isSmall
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isSmall ? "bg-gray-400" : "bg-gray-500"
                      }`}
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}