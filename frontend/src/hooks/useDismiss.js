import { useEffect } from "react";

/**
 * Calls onClose when the user clicks outside `ref` or presses Escape,
 * but only while `open` is true. Used by popovers and dropdown menus.
 */
export default function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, open, onClose]);
}