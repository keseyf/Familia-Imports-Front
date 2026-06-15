import { useEffect, useState, useRef } from "react"
import ScrollReveal from "scrollreveal"
import {
  BiSearch, BiX, BiPackage, BiTag,
  BiChevronDown, BiMenu, BiLogOut, BiCog,
} from "react-icons/bi"

function getAdminFromToken() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return { name: "Admin" }
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    return { name: payload.name ?? payload.username ?? "Admin" }
  } catch {
    return { name: "Admin" }
  }
}

const navLinks = [
  { label: "Produtos", href: "/admin",         icon: <BiTag /> },
  { label: "Pedidos",  href: "/admin/pedidos",  icon: <BiPackage /> },
]

export default function HeaderAdmin() {
  const [isSmall, setIsSmall]       = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const profileRef = useRef<HTMLDivElement>(null)
  const admin = getAdminFromToken()

  useEffect(() => {
    const onScroll = () => setIsSmall(window.scrollY >= 78)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  useEffect(() => {
    ScrollReveal().reveal("#header-admin", {
      origin: "top", delay: 200, distance: "40px", duration: 1000,
    })
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    window.location.href = "/admin/login"
  }

  return (
    <header
      id="header-admin"
      className={`w-full duration-300 sticky ${isSmall ? "top-3 px-3" : "top-0"} z-50`}
    >
      <div className={`w-full border border-black/30 duration-300 shadow-xl backdrop-blur-md ${
        isSmall ? "bg-white/90 rounded-2xl p-3" : "bg-gray-950 px-8 p-4 text-gray-200"
      }`}>
        <div className="flex items-center justify-between gap-4 px-2">

          {/* Logo */}
          <a href="/admin" className="flex items-center gap-2 hover:scale-90 duration-200 shrink-0">
            <img
              className="w-36"
              src={isSmall ? "./logodefinitiva.png" : "./logodefinitiva23.png"}
              alt="Logo"
            />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
              isSmall ? "bg-gray-900 text-white" : "bg-white/15 text-gray-300"
            }`}>
              Admin
            </span>
          </a>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSmall
                    ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Direita */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Busca */}
            <div className="relative hidden sm:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <BiSearch className={isSmall ? "text-gray-500" : "text-gray-400"} />
                  <input
                    autoFocus
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onBlur={() => { if (!searchValue) setSearchOpen(false) }}
                    placeholder="Buscar produto, pedido..."
                    className={`text-sm w-48 border-b focus:outline-none bg-transparent ${
                      isSmall
                        ? "text-gray-800 border-gray-400 placeholder-gray-400"
                        : "text-white border-gray-500 placeholder-gray-500"
                    }`}
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchValue("") }}>
                    <BiX className={isSmall ? "text-gray-500" : "text-gray-400"} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isSmall ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                  }`}
                >
                  <BiSearch className="text-lg" />
                </button>
              )}
            </div>

            {/* Configurações */}
            <a href="/admin/configuracoes"
              className={`hidden sm:block p-2 rounded-lg transition-all duration-200 ${
                isSmall ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <BiCog className="text-lg" />
            </a>

            {/* Perfil */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                  isSmall ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <span className={`hidden sm:block text-xs font-semibold ${isSmall ? "text-gray-800" : "text-white"}`}>
                  {admin.name}
                </span>
                <BiChevronDown className={`text-sm transition-transform duration-200 ${profileOpen ? "rotate-180" : ""} ${
                  isSmall ? "text-gray-500" : "text-gray-400"
                }`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <BiLogOut /> Sair
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className={`md:hidden p-2 rounded-lg ${isSmall ? "text-gray-700" : "text-gray-300"}`}
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <BiX className="text-xl" /> : <BiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Nav mobile */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200/20 flex flex-col gap-1 px-2 pb-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSmall ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 mt-1"
            >
              <BiLogOut /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}