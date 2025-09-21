import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

function Root() {
  const [clientId, setClientId] = useState<string | null>(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || null
  );
  const [loading, setLoading] = useState<boolean>(!clientId);

  useEffect(() => {
    if (clientId) return; // already provided via env
    const fetchClientId = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google-client-id");
        if (res.ok) {
          const data = await res.json();
          if (data?.clientId) setClientId(data.clientId);
        }
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchClientId();
  }, [clientId]);

  if (!clientId && loading) return null;

  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId || ""}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
  