import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

function renderComponent({
  wide = false,
  loading = false,
  className = "",
  onClick = jest.fn(),
} = {}) {
  render(
    <Button
      wide={wide}
      className={className}
      loading={loading}
      onClick={onClick}
    >
      Click me
    </Button>
  );

  const user = userEvent.setup();

  return { onClick, user };
}

describe("button", () => {
  test("render button with text", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const { onClick, user } = renderComponent();

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  test("renders in loading state", () => {
    renderComponent({ loading: true });
    const button = screen.getByRole("button");

    const buttonClickMe = screen.queryByText(/click me/i);

    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
    expect(button).toHaveClass("border-blue-300");
    expect(buttonClickMe).not.toBeInTheDocument();
  });

  test("applies wide styling when wide props is true", () => {
    renderComponent({ wide: true });
    const button = screen.getByRole("button");

    expect(button).toHaveClass("px-12");
    expect(button).not.toHaveClass("px-6");
  });

  test("applies custom class name", () => {
    renderComponent({ className: "custom-class" });
    const button = screen.getByRole("button");

    expect(button).toHaveClass("custom-class");
  });
});
