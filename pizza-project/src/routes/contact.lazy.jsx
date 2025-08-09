import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: ({ name, email, message }) => {
      return postContact(name, email, message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    console.log("Submitting data:", data);
    mutation.mutate(data);
  };

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3>Submitted!</h3>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <textarea placeholder="Message" name="message" required></textarea>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Submit"}
          </button>
          {mutation.isError && (
            <p style={{ color: "red" }}>
              Error: {mutation.error?.message || "Failed to send message"}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
