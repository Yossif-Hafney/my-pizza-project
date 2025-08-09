import Pizza from "./Pizza";
const intil = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export default function Cart({ cart, checkout }) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <Pizza
              name={item.pizza.name}
              description={item.pizza.description}
            />
            <p>{intil.format(item.pizza.sizes[item.size])}</p>
          </li>
        ))}
      </ul>
      <h3>Total: {intil.format(total)}</h3>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
