import { useEffect, useState } from "react";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(true);

  async function checkConnection() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      await fetch("https://www.google.com/generate_204", {
        method: "GET",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      setOnline(true);
    } catch (err) {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkConnection();

    function handleOnline() {
      checkConnection();
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(checkConnection, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
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
