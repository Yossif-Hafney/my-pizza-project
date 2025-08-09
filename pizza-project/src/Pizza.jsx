export default function Pizza(props) {
  return (
    <div className="pizza" onClick={() => console.log("Pizza clicked!")}>
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <img
        src={props.image ? props.image : "https://picsum.photos/200"}
        alt={props.name}
      />
    </div>
  );
}
