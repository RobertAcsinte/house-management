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