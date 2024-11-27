import { expect, it } from 'vitest'
import LoginPage from "./LoginPage.tsx";
import {renderWithProviders} from "../../../utils/test-utils.tsx";

it("Snapshot Login Page", () => {
    const snapshot = renderWithProviders(<LoginPage />)
    expect(snapshot).toMatchSnapshot()
})