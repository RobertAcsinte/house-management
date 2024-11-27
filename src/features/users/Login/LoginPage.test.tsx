import { expect, it, vi } from 'vitest'
import LoginPage from "./LoginPage.tsx";
import {renderWithProviders} from "../../../utils/test-utils.tsx";
import {fireEvent, screen} from '@testing-library/react'


it("Snapshot Login Page", () => {
    const snapshot = renderWithProviders(<LoginPage />)
    expect(snapshot).toMatchSnapshot()
})

it("Invalid email format and password fields", async () => {
    renderWithProviders(<LoginPage/>)
    fireEvent.click(screen.getByText('Login'))
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
})