import { expect, it, afterEach } from 'vitest'
import LoginPage from "./LoginPage.tsx";
import {renderWithProviders} from "../../../utils/test-utils.tsx";
import {cleanup, fireEvent, screen} from '@testing-library/react'


afterEach(() => {
    cleanup();
});

it("Snapshot Login Page", () => {
    const snapshot = renderWithProviders(<LoginPage />)
    expect(snapshot).toMatchSnapshot()
})

it("Empty email and password fields", async () => {
    renderWithProviders(<LoginPage/>)
    fireEvent.click(screen.getByText('Login'))
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
})

it("Should display error when email is invalid", async () => {
    renderWithProviders(<LoginPage/>)

    fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
        target: {
            value: "test"
        }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
        target: {
            value: "password"
        }
    });

    fireEvent.submit(screen.getByRole("button", {name: /login/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: /email/i }).value).toEqual("test");
    expect(screen.getByLabelText<HTMLInputElement>("password").value).toEqual("password");
});

