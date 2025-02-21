import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";
// msw mock service worker
// array of handlers

createServer([
  {
    path: "/api/repositories",
    res: (req, res, ctx) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

function renderComponent() {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
}

test("render two links for each language", async () => {
  renderComponent();

  // Loop over each language get the languages from conlose.log at handlers function at the top
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });
    // For each language, make surewe see two links
    expect(links).toHaveLength(2);
    // Assert that the links have the appropirate full_name
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
});

const pause = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
