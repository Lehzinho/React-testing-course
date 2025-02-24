import { screen, render } from "@testing-library/react";
import Input from "./Input";
import userEvent from "@testing-library/user-event";
function renderComponent({
  className = "",
  label = "Email",
  name = "email",
  error = null,
  value = "",
  type = "text",
  onChange = jest.fn(),
} = {}) {
  render(
    <Input
      className={className}
      error={error}
      label={label}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
    />
  );

  const user = userEvent.setup();

  return { onChange, user };
}

describe("Input", () => {
  test("renders input with label", () => {
    renderComponent();

    // screen.debug();
    const label = screen.getByText(/email/i);
    const input = screen.getByLabelText(/email/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("applies custom class name", () => {
    renderComponent({ className: "custom-class" });

    const input = screen.getByLabelText(/email/i);

    expect(input).toHaveClass("custom-class");
  });

  test("call onChange when input changes", async () => {
    const { onChange, user } = renderComponent({ className: "custom-class" });

    const input = screen.getByRole("textbox");

    await user.type(input, "test@example.com");

    expect(onChange).toHaveBeenCalled();
  });

  test("displays error message when error is present", () => {
    renderComponent({ error: { email: ["invalid email"] } });

    const errorMessage = screen.getByText("invalid email");

    expect(errorMessage).toBeInTheDocument();
  });

  test("applies error styling to textbox when error is present", () => {
    renderComponent({ error: { email: ["invalid email"] } });

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("border-red-500");
  });
});
