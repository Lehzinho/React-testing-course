import { render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router-dom";

// troca o componente pela menssgem
// jest.mock("../tree/FileIcon", () => {
//   // Content of FileIcon.js
//   return () => {
//     return "file Icon Component";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: { login: "facebook" },
    name: "htttps://github.com/facebook/react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("shows a link  to the github homepage for this repository", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });

  const link = screen.getByRole("link", { name: /github repository/i });
  expect(link).toHaveAttribute("href", repository.html_url);
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", { name: "Javascript" });

  const link = screen.getByRole("link", {
    name: RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});

// bom debug metodo
// test("shows a link  to the github homepage for this repository", async () => {
//   renderComponent();
//
//   screen.debug();
//   await pause();
//   screen.debug();
//
// });

// const pause = () => {
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       resolve();
//     }, 100)
//   );
// };
