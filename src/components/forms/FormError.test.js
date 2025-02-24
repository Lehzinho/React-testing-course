import { screen, render } from "@testing-library/react";
import FormError from "./FormError";

function renderComponent({ error = null, className = "test-class" } = {}) {
  render(<FormError error={error} className={className} />);
}

describe("FormError", () => {
  test("render error with Message", () => {
    renderComponent({ error: { message: "email nao encontrado" } });

    const error = screen.getByText(/email nao encontrado/i);

    expect(error).toBeInTheDocument();
  });

  test("applies custom class name", () => {
    renderComponent({ error: { message: "email nao encontrado" } });

    const error = screen.getByText(/email nao encontrado/i);

    expect(error).toHaveClass("test-class");
  });

  test("expect error to not be on the document", () => {
    renderComponent();

    const error = screen.queryByText(/something/i);

    expect(error).not.toBeInTheDocument();
  });
});
