import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = ainda carregando

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  if (user === undefined) return <div className="p-4">A verificar acesso...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
