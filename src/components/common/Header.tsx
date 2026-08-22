import { useEffect, useState, useRef } from "react"
import { BiMenu, BiX, BiChevronDown } from "react-icons/bi"
import ScrollReveal from "scrollreveal"

type NavItem = {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    label: "Roupas",
    children: [
      { label: "Camisetas", href: "#camisetas" },
      { label: "Calças", href: "#calcas" },
      { label: "Shorts", href: "#short" },
      { label: "Bobojaco", href: "#bobojaco" },
      { label: "Moletom", href: "#moletom" },
      { label: "Jaquetas", href: "#jaqueta" },
    ],
  },
  {
    label: "Conjuntos",
    children: [
      { label: "Conjuntos Masculinos", href: "#conjuntoM" },
      { label: "Conjuntos Femininos", href: "#conjuntoF" },
    ],
  },
  { label: "Tênis", href: "#tenis" },
  { label: "Acessórios", href: "#acessorios" },
]

function sectionExists(href: string) {
  if (typeof document === "undefined") return true
  return !!document.querySelector(href)
}

function getAvailableNavItems(): NavItem[] {
  return navItems
    .map(item => {
      if (item.children) {
        const children = item.children.filter(child => sectionExists(child.href))
        if (children.length === 0) return null
        return { ...item, children }
      }
      if (item.href && !sectionExists(item.href)) return null
      return item
    })
    .filter((item): item is NavItem => item !== null)
}

export default function Header() {
  const [isFixed, setIsFixed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null)
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null)
  const [items, setItems] = useState<NavItem[]>([])
  const headerRef = useRef<HTMLElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Checa assim que possível...
    setItems(getAvailableNavItems())

    // ...e continua observando o DOM, caso as seções montem depois (lazy/async)
    const observer = new MutationObserver(() => {
      setItems(getAvailableNavItems())
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

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
      if (window.innerWidth >= 640) {
        setMobileOpen(false)
        setMobileSubOpen(null)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function openDropdown(label: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setDesktopOpen(label)
  }

  function scheduleClose() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    closeTimeout.current = setTimeout(() => setDesktopOpen(null), 150)
  }

  const desktopMenu = (isLight: boolean) => (
    <ul className="lg:flex hidden flex-wrap justify-center font-medium gap-6 items-center">
      {items.map(item => (
        <li
          key={item.label}
          className="relative"
          onMouseEnter={() => item.children && openDropdown(item.label)}
          onMouseLeave={() => item.children && scheduleClose()}
        >
          {item.children ? (
            <button
              className={`flex items-center gap-1 text-sm duration-200 transition-all ${
                isLight
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-200 hover:text-white"
              } ${desktopOpen === item.label ? (isLight ? "text-gray-900" : "text-white") : ""}`}
              aria-expanded={desktopOpen === item.label}
            >
              {item.label}
              <BiChevronDown
                className={`text-base transition-transform duration-200 ${
                  desktopOpen === item.label ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <a
              href={item.href}
              className={`text-sm duration-200 transition-all ${
                isLight
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          )}

          {item.children && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 ${
                desktopOpen === item.label
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <ul
                className={`min-w-[200px] rounded-xl border shadow-xl overflow-hidden ${
                  isLight
                    ? "bg-white border-black/10"
                    : "bg-primary border-white/10 shadow-black/50"
                }`}
              >
                {item.children.map(child => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      className={`block px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-150 ${
                        isLight
                          ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  )

  const mobileMenu = (isLight: boolean) => (
    <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
      mobileOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
    }`}>
      <ul className={`flex flex-col gap-1 pb-2 border-t pt-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
        {items.map((item, i) => (
          <li
            key={item.label}
            style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
            className={`transition-all duration-300 ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
          >
            {item.children ? (
              <>
                <button
                  onClick={() =>
                    setMobileSubOpen(mobileSubOpen === item.label ? null : item.label)
                  }
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isLight
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`} />
                    {item.label}
                  </span>
                  <BiChevronDown
                    className={`text-base transition-transform duration-200 ${
                      mobileSubOpen === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileSubOpen === item.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="pl-9 py-1 flex flex-col gap-1">
                    {item.children.map(child => (
                      <li key={child.href}>
                        <a
                          href={child.href}
                          onClick={() => {
                            setMobileOpen(false)
                            setMobileSubOpen(null)
                          }}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isLight
                              ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                              : "text-gray-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isLight
                    ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`} />
                {item.label}
              </a>
            )}
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
            {desktopMenu(false)}
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
            {desktopMenu(true)}
            {hamburger(true)}
          </nav>
          {mobileMenu(true)}
        </div>
      </header>
    </>
  )
}