import { useEffect, useState } from "react";

export default function NotFound() {
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return <>{path}</>;
}
