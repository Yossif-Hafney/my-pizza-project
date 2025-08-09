import { useContext } from "react";
import { CartContext } from "./contexts.jsx";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [cart] = useContext(CartContext);
  return (
    <header>
      <nav>
        <Link to="/">
          <h1 className="logo">Padrino Pizza -Order Now</h1>
        </Link>

        <div className="nav-cart">
          <i className="fa fa-shopping-cart"></i>
          <span className="nav-cart-number">{cart.length}</span>
        </div>
      </nav>
    </header>
  );
}
