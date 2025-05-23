import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const useCallBackOnNavigate = (callback: () => void) => {
  const location = useLocation();
  const prevPathname = useRef<string | undefined>();

  useEffect(() => {
    // Membandingkan path sebelumnya dengan path saat ini
    if (prevPathname.current !== location.pathname) {
      callback();
      prevPathname.current = location.pathname; // Memperbarui nilai path sebelumnya
    }
  }, [callback, location]);
};

export default useCallBackOnNavigate;
