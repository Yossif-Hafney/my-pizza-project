import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="index">
      <div className="index-brand">
        <h1>Padre Gino's Pizza</h1>
        <p>Order your favorite pizza online!</p>
      </div>
      <ul>
        <li>
          <Link to="/order">Order Now</Link>
        </li>
        <li>
          <Link to="/past"> Past Orders</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
}
