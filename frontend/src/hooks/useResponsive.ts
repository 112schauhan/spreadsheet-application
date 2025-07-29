import { useState, useEffect } from 'react';
const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const listener = () => setWidth(window.innerWidth);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);
  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 992,
    isDesktop: width >= 992
  };
};

export default useResponsive;