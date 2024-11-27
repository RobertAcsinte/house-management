import { expect, it, afterEach } from 'vitest'
import {renderWithProviders} from "../../../utils/test-utils.tsx";
import {cleanup, fireEvent, screen} from '@testing-library/react'
import RegisterPage from "./RegisterPage.tsx";

afterEach(() => {
    cleanup()
})

it("Snapshot Register page", () => {
    const snapshot = renderWithProviders(<RegisterPage />)
    expect(snapshot).toMatchSnapshot()
})

it("Show errors for fields when you try to submit and they are empty", async () => {
    renderWithProviders(<RegisterPage/>)
    fireEvent.click(screen.getByRole("button", {name: /register/i}))
    expect(await screen.findAllByRole("alert")).toHaveLength(4)
})

it("Show error if email field is not with the correct format", async () => {
    renderWithProviders(<RegisterPage/>)
    fireEvent.input(screen.getByRole("textbox", {name: /email/i}), {
        target: {
            value: "test"
        }
    })
    fireEvent.input(screen.getByRole("textbox", {name: /name/i}), {
        target: {
            value: "My name"
        }
    })
    fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: "123456" }
    });

    fireEvent.input(screen.getByLabelText(/^repeatpassword$/i), {
        target: { value: "123456" }
    });

    fireEvent.submit(screen.getByRole("button", {name: /register/i}))

    expect(await screen.findAllByRole("alert")).toHaveLength(1)
})

it("Show error if password don't match", async () => {
    renderWithProviders(<RegisterPage/>)
    fireEvent.input(screen.getByRole("textbox", {name: /email/i}), {
        target: {
            value: "test@test.test"
        }
    })
    fireEvent.input(screen.getByRole("textbox", {name: /name/i}), {
        target: {
            value: "My name"
        }
    })
    fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: "123456789" }
    });

    fireEvent.input(screen.getByLabelText(/^repeatpassword$/i), {
        target: { value: "123456" }
    });

    fireEvent.submit(screen.getByRole("button", {name: /register/i}))

    expect(await screen.findAllByRole("alert")).toHaveLength(1)
})