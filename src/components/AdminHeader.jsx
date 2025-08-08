export default function AdminHeader({ onMenuToggle, menuOpen }) {
    return (
      <header className="w-full px-4 py-4 md:py-10 relative font-sans text-texto bg-fundo">
      {/* Mobile */}
      <div className="md:hidden relative flex items-center">
        {/* Botão de menu/cruz à esquerda */}
        <button
          onClick={onMenuToggle}
          className="z-50"
          aria-label="Alternar menu"
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                menuOpen ? "rotate-45 top-3" : "top-[6px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                menuOpen ? "opacity-0" : "top-[12px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                menuOpen ? "-rotate-45 top-3" : "top-[18px]"
              }`}
            />
          </div>
        </button>

        {/* Título com margem à esquerda */}
        <h1 className="font-serif tracking-widest text-2xl ml-10">
          JOÃO GAMA
          <span className="ml-2 text-xs px-2 py-1 rounded align-middle bg-texto text-fundo">
            Admin
          </span>
        </h1>
      </div>
  
        {/* Desktop */}
        <div className="hidden md:flex justify-center">
          <h1 className="font-serif tracking-widest text-4xl text-center">
            JOÃO GAMA
            <span className="ml-2 text-sm px-2 py-1 rounded-lg align-middle bg-texto text-fundo">
              Admin
            </span>
          </h1>
        </div>
      </header>
    );
  }
  