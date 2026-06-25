import { useCallback, useEffect, useState } from "react";

export default function useHorizontalScroll() {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const ref = useCallback((node: HTMLDivElement | null) => setEl(node), []);

  const update = useCallback(() => {
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [el]);

  useEffect(() => {
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [el, update]);

  const scrollByDir = useCallback(
    (dir: number) => el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" }),
    [el]
  );

  return { ref, canScrollLeft, canScrollRight, scrollByDir };
}
