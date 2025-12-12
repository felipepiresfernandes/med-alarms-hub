import { useState, useEffect } from "react";

export const useFirstTimeSetup = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    // Verifica se o setup já foi feito usando localStorage por enquanto
    const setupCompleted = localStorage.getItem("suplimed_setup_completed");
    setNeedsSetup(!setupCompleted);
    setIsChecking(false);
  }, []);

  const completeSetup = () => {
    localStorage.setItem("suplimed_setup_completed", "true");
    setNeedsSetup(false);
  };

  return { isChecking, needsSetup, completeSetup };
};
