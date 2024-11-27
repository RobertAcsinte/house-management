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
