import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Cart from "../cart";

test("snapshot with nothing in cart", () => {
  const { asFragment } = render(<Cart cart={[]} />);
  expect(asFragment()).toMatchSnapshot();
});
