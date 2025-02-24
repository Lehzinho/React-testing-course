import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesTable from "./RepositoriesTable";

function renderComponent({
  label = "Popular Repositories",
  repositories = [],
  id = "repos-table",
} = {}) {
  render(
    <MemoryRouter>
      <RepositoriesTable label={label} repositories={repositories} id={id} />
    </MemoryRouter>
  );
}

describe("RepositoriesTable", () => {
  test("renders the provided label", () => {
    renderComponent({ label: "Test Repositories" });

    const label = screen.getByText("Test Repositories");

    expect(label).toBeInTheDocument();
  });

  test("renders the heading with correct id", () => {
    renderComponent({ id: "custom-id" });
    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("id", "custom-id");
  });

  test("renders repository links", () => {
    const repositories = [
      { id: 1, full_name: "user1/repo1" },
      { id: 2, full_name: "user2/repo2" },
    ];

    renderComponent({ repositories });

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("user1/repo1");
    expect(links[1]).toHaveTextContent("user2/repo2");
  });

  test("links have correct href attributes", () => {
    const repositories = [{ id: 1, full_name: "user1/repo1" }];

    renderComponent({ repositories });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/repositories/user1/repo1");
  });

  test("renders no links when repositories is null", () => {
    renderComponent({ repositories: null });

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  test("renders no links when repositories is empty", () => {
    renderComponent({ repositories: [] });

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});
