import { screen, render } from "@testing-library/react";
import Label from "./Label";

function renderComponent({ className = "test-class", name = "email" } = {}) {
  render(<Label className={className}>{name}</Label>);
}

describe("Label", () => {
  test("renders label", () => {
    renderComponent();

    const label = screen.getByText(/email/i);
    expect(label).toBeInTheDocument();
  });

  test("applies custom class name", () => {
    renderComponent();
    const label = screen.getByText(/email/i);

    expect(label).toHaveClass("test-class");
  });
});
