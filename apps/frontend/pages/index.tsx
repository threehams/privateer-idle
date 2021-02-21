import React, { useEffect, useState } from "react";
import { Game } from "../components/Game";

export const Index = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <Game />;
};

export default Index;
