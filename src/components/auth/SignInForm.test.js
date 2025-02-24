import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "./SignInForm";
import useSignIn from "../../hooks/useSignIn";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks/useSignIn");

function renderComponent() {
  const mockSignIn = jest.fn();
  useSignIn.mockReturnValue({
    signIn: mockSignIn,
    error: null,
    isLoading: false,
    isSignedIn: false,
  });

  render(
    <MemoryRouter>
      <SignInForm />
    </MemoryRouter>
  );

  return { mockSignIn };
}

describe("SignInForm", () => {
  test("renders the form inputs and button", async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const buttonSubimit = screen.getByRole("button");
    const signUpButton = screen.getByRole("link");

    // screen.debug();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(buttonSubimit).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test("calls signIn function onform submission", async () => {
    const { mockSignIn } = renderComponent();

    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const buttonSubimit = screen.getByRole("button");

    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "test123");
    await user.click(buttonSubimit);

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "test123",
    });
  });
});
