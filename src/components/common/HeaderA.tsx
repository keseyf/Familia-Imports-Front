import { useEffect, useState, useRef } from "react"
import ScrollReveal from "scrollreveal"
import {
  BiSearch,
  BiUser,
  BiBell,
  BiPackage,
  BiStore,
  BiBarChartAlt2,
  BiCog,
  BiLogOut,
  BiChevronDown,
  BiMenu,
  BiX,
  BiPlus,
  BiTag,
} from "react-icons/bi"

type Admin = {
  name: string
  email: string
  avatar?: string
  role: string
}

const mockAdmin: Admin = {
  name: "Carlos Silva",
  email: "carlos@loja.com",
  role: "Super Admin",
}

const notifications = [
  { id: 1, text: "Novo pedido #1042 recebido", time: "2 min atrás", unread: true },
  { id: 2, text: "Estoque baixo: Boné Preto (2 un.)", time: "15 min atrás", unread: true },
  { id: 3, text: "Pedido #1039 enviado com sucesso", time: "1h atrás", unread: false },
]

export default function HeaderAdmin() {
  const [isSmall, setIsSmall] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => n.unread).length

  // Scroll shrink
  useEffect(() => {
    function handleScroll() {
      setIsSmall(window.scrollY >= 78)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // ScrollReveal
  useEffect(() => {
    ScrollReveal().reveal("#header-admin", {
      origin: "top",
      delay: 200,
      distance: "40px",
      duration: 1000,
    })
  }, [])

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: <BiBarChartAlt2 /> },
    { label: "Pedidos", href: "/admin/pedidos", icon: <BiPackage /> },
    { label: "Produtos", href: "/admin/produtos", icon: <BiTag /> },
    { label: "Loja", href: "/admin/loja", icon: <BiStore /> },
  ]

  return (
    <header
      id="header-admin"
      className={`w-full duration-300 sticky ${isSmall ? "top-3 px-3" : "top-0"} z-50`}
    >
      <div
        className={`w-full border border-black/30 duration-300 shadow-3xl shadow-black/50 backdrop-blur-md ${
          isSmall
            ? "bg-white/90 rounded-2xl p-3"
            : "bg-gray-950 px-8 p-4 text-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-2">

          {/* Logo + Badge */}
          <a href="/admin" className="flex items-center gap-2 hover:scale-90 duration-200 shrink-0">
            <img
              className="w-36"
              src={isSmall ? "./logodefinitiva.png" : "./logodefinitiva23.png"}
              alt="Logo"
            />
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                isSmall ? "bg-gray-900 text-white" : "bg-white/15 text-gray-300"
              }`}
            >
              Admin
            </span>
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
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

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 animate-in fade-in">
                  <BiSearch className={isSmall ? "text-gray-500" : "text-gray-400"} />
                  <input
                    autoFocus
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onBlur={() => { if (!searchValue) setSearchOpen(false) }}
                    placeholder="Buscar produto, pedido..."
                    className={`text-sm w-48 border-b focus:outline-none bg-transparent transition-all ${
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
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isSmall ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                  }`}
                >
                  <BiSearch className="text-lg" />
                </button>
              )}
            </div>

            {/* Quick add product */}
            <a
              href="/admin/produtos/novo"
              className={`hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isSmall
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              <BiPlus className="text-base" />
              Produto
            </a>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                  isSmall ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <BiBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-800 text-sm">Notificações</span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                  <ul>
                    {notifications.map(n => (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                          n.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-blue-500" : "bg-transparent"}`} />
                        <div>
                          <p className="text-sm text-gray-800">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a href="/admin/notificacoes" className="block text-center text-xs text-gray-500 hover:text-gray-800 py-3 transition">
                    Ver todas
                  </a>
                </div>
              )}
            </div>

            {/* Config */}
            <a
              href="/admin/configuracoes"
              className={`hidden sm:block p-2 rounded-lg transition-all duration-200 ${
                isSmall ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <BiCog className="text-lg" />
            </a>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                  isSmall ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {mockAdmin.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-xs font-semibold leading-tight ${isSmall ? "text-gray-800" : "text-white"}`}>
                    {mockAdmin.name}
                  </p>
                  <p className={`text-[10px] ${isSmall ? "text-gray-400" : "text-gray-400"}`}>
                    {mockAdmin.role}
                  </p>
                </div>
                <BiChevronDown className={`text-sm transition-transform duration-200 ${profileOpen ? "rotate-180" : ""} ${isSmall ? "text-gray-500" : "text-gray-400"}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{mockAdmin.name}</p>
                    <p className="text-xs text-gray-400">{mockAdmin.email}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <a href="/admin/perfil" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <BiUser /> Meu Perfil
                      </a>
                    </li>
                    <li>
                      <a href="/admin/configuracoes" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <BiCog /> Configurações
                      </a>
                    </li>
                  </ul>
                  <div className="border-t border-gray-100 py-1">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition">
                      <BiLogOut /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className={`md:hidden p-2 rounded-lg ${isSmall ? "text-gray-700" : "text-gray-300"}`}
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <BiX className="text-xl" /> : <BiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200/20 flex flex-col gap-1 px-2 pb-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSmall
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </a>
            ))}
            <a
              href="/admin/produtos/novo"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mt-1 ${
                isSmall ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <BiPlus /> Novo Produto
            </a>
          </div>
        )}
      </div>
    </header>
  )
}