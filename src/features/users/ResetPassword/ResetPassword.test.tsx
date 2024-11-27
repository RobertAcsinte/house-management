import { expect, it, afterEach } from 'vitest'
import {renderWithProviders} from "../../../utils/test-utils.tsx";
import {cleanup, fireEvent, screen} from '@testing-library/react'
import ResetPassword from "./ResetPassword.tsx";

afterEach(() => {
    cleanup()
})

it("Snapshot Reset Password page", () => {
    const snapshot = renderWithProviders(<ResetPassword />)
    expect(snapshot).toMatchSnapshot()
})

it("Show error when you try to submit with empty field", async () => {
    renderWithProviders(<ResetPassword/>)
    fireEvent.submit(screen.getByRole("button", {name: /reset/i}))
    expect(await screen.findAllByRole("alert")).toHaveLength(1)
})

it("Show error when email has the wrong format", async () => {
    renderWithProviders(<ResetPassword/>)
    fireEvent.input(screen.getByLabelText(/email/i), {
        target: {
            value: "test"
        }
    })
    fireEvent.submit(screen.getByRole("button", {name: /reset/i}))
    expect(await screen.findAllByRole("alert")).toHaveLength(1)
})
