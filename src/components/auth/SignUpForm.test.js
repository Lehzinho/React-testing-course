import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SignUpForm from "./SignUpForm";
import useSignUp from "../../hooks/useSignUp";

jest.mock("../../hooks/useSignUp");
function renderComponent(error = null, isLoading = false, isSignedIn = false) {
  const mockSignUp = jest.fn();
  useSignUp.mockReturnValue({
    signUp: mockSignUp,
    error,
    isLoading,
    isSignedIn,
  });
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  );

  return { mockSignUp, user };
}
describe("SignUpForm", () => {
  test("renders the forms, buttons and links", () => {
    renderComponent();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const passwordConfirmationInput = screen.getByLabelText(
      /password confirmation/i
    );
    const marketingCheckbox = screen.getByLabelText(
      /receive marketing emails/i
    );
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    const signInText = screen.getByText(/already have an account/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmationInput).toBeInTheDocument();
    expect(marketingCheckbox).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    expect(signInText).toBeInTheDocument();
  });

  test("allows users to type into the input fields", async () => {
    const { user } = renderComponent();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const passwordConfirmationInput = screen.getByLabelText(
      /password confirmation/i
    );

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(passwordConfirmationInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(passwordConfirmationInput).toHaveValue("password123");
  });

  test("calls signUp when the form is submitted", async () => {
    const { mockSignUp, user } = renderComponent();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const passwordConfirmationInput = screen.getByLabelText(
      /password confirmation/i
    );
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    // Simulate typing into the fields
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(passwordConfirmationInput, "password123");

    // Submit the form explicitly if needed
    await user.click(submitButton);

    // Check if the mock function was called with the expected values
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      passwordConfirmation: "password123",
    });
  });

  test("displays loading state when isLoading is true", () => {
    renderComponent(null, true);
    const submitButton = screen.getByRole("button");
    expect(submitButton).toHaveAttribute("disabled");
  });

  test("redirects to home when user is signed in", () => {
    renderComponent(null, false, true);

    const redirect = screen.queryByRole("form");

    expect(redirect).not.toBeInTheDocument();
  });

  test("handles marketing checkbox toggle", async () => {
    const { user } = renderComponent();
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
