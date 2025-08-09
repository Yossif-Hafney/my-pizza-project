import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
const Modal = ({ children }) => {
  const eleRef = useRef(null);
  if (!eleRef.current) {
    eleRef.current = document.createElement("div");
    eleRef.current.className = "modal";
  }
  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(eleRef.current);
    return () => {
      modalRoot.removeChild(eleRef.current);
    };
  }, []);
  return createPortal(<div>{children}</div>, eleRef.current);
};
export default Modal;
