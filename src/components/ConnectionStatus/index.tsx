import { useEffect, useState } from "react";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div style={{
      background: "red",
      color: "white",
      padding: "10px",
      textAlign: "center",
      fontWeight: "bold",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      zIndex: 9999
    }}>
      ❌ Você está sem conexão com a internet
    </div>
  );
}
