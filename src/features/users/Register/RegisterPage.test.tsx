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