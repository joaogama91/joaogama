import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔁 Controls mobile drawer

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  if (loading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="min-h-screen flex bg-fundo text-texto font-sans">
      {/* AdminSidebar receives toggle state */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* AdminHeader sends toggle handler */}
        <AdminHeader
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          menuOpen={sidebarOpen}
        />

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
