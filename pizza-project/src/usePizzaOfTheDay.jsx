import { useState, useEffect, useDebugValue } from "react";
export default function usePizzaOfTheDay() {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  
  useDebugValue(pizzaOfTheDay ? pizzaOfTheDay.name : "Loading...");

  useEffect(() => {
    const fetchData = async () => {
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await fetch("/api/pizza-of-the-day");
      const data = await response.json();
      setPizzaOfTheDay(data);
    };
    fetchData();
  }, []);
  return pizzaOfTheDay;
}
