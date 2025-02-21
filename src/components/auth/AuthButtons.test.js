import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import { createServer } from "../../test/server";
import { SWRConfig } from "swr";
async function renderComponent() {
  render(
    // use SWRConfig to clear the response that swr store in cash
    // is in the swr docs https://swr.vercel.app/docs/advanced/cache
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  const buttons = await screen.findAllByRole("link");
  return { buttons };
}

// run in the terminal npm run test:debug then go to my brower and enter
// chrome://inspect/#devices to debug in crome
// to test one by one use .only after describe or test ex dercribe.only() or test.only()
describe("When user is signeg in", () => {
  // createServer() ---> GET '/api/user' ---> { "id": 1, "email": "teste@gmail.com" }
  createServer([
    {
      path: "/api/user",
      res: () => {
        //debug mode
        //console.log("-----------------> loged in response");
        return {
          user: { id: 1, email: "teste@gmail.com" },
        };
      },
    },
  ]);

  test("Sign in and sign up are  not visivle", async () => {
    await renderComponent();

    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("Sign out is visivle", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", { name: /sign out/i });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});

describe("When user is not signed in", () => {
  // createServer() ---> GET '/api/user' ---> { user: null }
  createServer([
    {
      path: "/api/user",
      method: "get",
      res: (req, res, ctx) => {
        //debug mode
        //console.log("-----------------> Not loged in response");

        return {
          user: null,
        };
      },
    },
  ]);

  test("Sign in and sign up are visivle", async () => {
    const { buttons } = await renderComponent();

    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signOutButton = screen.getByRole("link", { name: /sign up/i });

    expect(buttons).toHaveLength(2);
    expect(signInButton).toHaveTextContent(/sign in/i);
    expect(signOutButton).toHaveTextContent(/sign up/i);
  });

  test("Sign out is not visible", async () => {
    await renderComponent();

    await screen.findAllByRole("link");

    const button = screen.queryByRole("link", { name: /sign out/i });

    expect(button).not.toBeInTheDocument();
  });
});

const pause = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 100)
  );
};
