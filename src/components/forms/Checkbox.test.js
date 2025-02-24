import { render, screen } from "@testing-library/react";
import Checkbox from "./Checkbox";

import userEvent from "@testing-library/user-event";

jest.mock(
  "./Label",
  () =>
    function MockLabel(props) {
      return (
        <label data-testid="mock-label" htmlFor={props.htmlFor}>
          {props.children}
        </label>
      );
    }
);
function renderComponent({
  className = "",
  label = "Test label",
  name = "test-checkbox",
  checked = false,
  onChange = jest.fn(),
} = {}) {
  render(
    <Checkbox
      className={className}
      label={label}
      name={name}
      checked={checked}
      onChange={onChange}
    />
  );

  return { onChange };
}

describe("Checkbox", () => {
  test("renders checkbox with label", () => {
    renderComponent();

    const checkbox = screen.getByRole("checkbox");
    const labelComponent = screen.getByTestId("mock-label");
    expect(checkbox).toBeInTheDocument();
    expect(labelComponent).toHaveTextContent("Test label");
  });

  test("correctly sets id and htmlFor attributes", () => {
    renderComponent({
      name: "custom-name",
    });

    const checkbox = screen.getByRole("checkbox");
    const labelComponent = screen.getByTestId("mock-label");

    expect(checkbox).toHaveAttribute("id", "custom-name");
    expect(labelComponent).toHaveAttribute("for", "custom-name");
  });

  test("applies custom class name", () => {
    renderComponent({
      className: "test_class",
    });
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveClass("test_class");
  });

  test("handles checked state", () => {
    renderComponent({ checked: true });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("calls onChange when clicked", async () => {
    const { onChange } = renderComponent();
    const user = userEvent.setup();
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});
