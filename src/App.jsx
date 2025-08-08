import i18n from './i18n';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home';
import Projetos from './pages/Projetos';
import ProjectPage from './pages/ProjectPage';
import Galeries from './pages/Galeries';
import GaleriePage from './pages/GaleriePage';
import Murais from './pages/Murais';
import MuralPage from './pages/MuralPage';

import Login from './pages/Login';
import Admin from './pages/Admin';
import ThemeEditor from './pages/ThemeEditor';
import AdminHomeEditor from './pages/AdminHomeEditor';
import AdminAboutEditor from './pages/AdminAboutEditor';
import AdminContactsEditor from './pages/AdminContactsEditor';
import AdminProjectsEditor from './pages/AdminProjectsEditor';
import AdminGalleriesEditor from './pages/AdminGalleriesEditor';
import AdminMuralsEditor from './pages/AdminMuralsEditor';

import HamburgerMenu from './components/HamburgerMenu';
import PrivateRoute from './components/PrivateRoute';
import Sobre from './pages/About';
import Contactos from './pages/Contacts';

import { supabase } from './supabase';
import { applyThemeToRoot } from './utils/useApplyTheme';
import MenuVerticalHorizontal from './components/MenuVerticalHorizontal';

function SiteLayout() {
  const { i18n } = useTranslation();
  const [menuLayout, setMenuLayout] = useState('vertical');

  useEffect(() => {
    const loadTheme = async () => {
      const { data } = await supabase
        .from('theme_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        applyThemeToRoot(data);
        setMenuLayout(data.menu_layout || 'vertical');
      }
    };

    loadTheme();
  }, []);

  return (
    <div className="font-sans text-texto bg-fundo min-h-screen w-full relative">
      {menuLayout === 'vertical' && (
        <div className="hidden md:block px-8 max-w-5xl mx-auto">
          <MenuVerticalHorizontal layout="vertical" />
        </div>
      )}

      <header className="w-full px-4 pt-4 md:pt-8 md:text-center relative">
        <div className="md:hidden relative flex items-center justify-center">
          <h1 className="font-serif tracking-widest text-2xl text-center">JOÃO GAMA</h1>
          <div className="absolute left-0">
            <HamburgerMenu />
          </div>
        </div>

        <h1 className="hidden md:block font-serif tracking-widest text-4xl text-center mb-0">
          JOÃO GAMA
        </h1>

        {menuLayout === 'horizontal' && (
          <div className="hidden md:flex justify-center w-full bg-fundo z-10 mt-4">
            <div className="w-full max-w-5xl">
              <MenuVerticalHorizontal layout="horizontal" />
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 space-x-2 text-sm">
          <button
            onClick={() => i18n.changeLanguage('pt')}
            className={i18n.language === 'pt' ? 'font-bold underline' : ''}
          >
            PT
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={i18n.language === 'en' ? 'font-bold underline' : ''}
          >
            EN
          </button>
        </div>
      </header>

      <div className="md:hidden px-4 text-center">
        <Outlet />
      </div>

      <div className="hidden md:block px-8 max-w-5xl mx-auto pt-4 pb-8">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminHomeEditor />} />
        <Route path="Sobre" element={<AdminAboutEditor />} />
        <Route path="Contactos" element={<AdminContactsEditor />} />
        <Route path="Projetos" element={<AdminProjectsEditor />} />
        <Route path="Galerias" element={<AdminGalleriesEditor />} />
        <Route path="Murais" element={<AdminMuralsEditor />} />
        <Route path="Tema" element={<ThemeEditor />} />
      </Route>

      <Route path="/" element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="projetos/:slug" element={<ProjectPage />} />
        <Route path="galerias" element={<Galeries />} />
        <Route path="galerias/:slug" element={<GaleriePage />} />
        <Route path="murais" element={<Murais />} />
        <Route path="murais/:slug" element={<MuralPage />} />
        <Route path="Sobre" element={<Sobre />} />
        <Route path="Contactos" element={<Contactos />} />
      </Route>
    </Routes>
  );
}
