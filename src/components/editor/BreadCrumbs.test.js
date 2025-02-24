import { render, screen } from "@testing-library/react";
import Breadcrumbs from "./Breadcrumbs";

function renderComponent(path) {
  render(<Breadcrumbs path={path} />);
}

describe("Breadcrumbs", () => {
  test("render path segments correctly", () => {
    renderComponent("popular/react/jest");

    const pathSEgments = ["popular", "react", "jest"];
    for (const item of pathSEgments) {
      const path = screen.getByText(RegExp(item));
      expect(path).toBeInTheDocument();
    }
  });

  test("render correct number of separators", () => {
    renderComponent("popular/react/jest");

    const separators = screen.getAllByLabelText("separator");

    expect(separators).toHaveLength(2);
  });
});
