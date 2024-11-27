import {render, RenderOptions} from "@testing-library/react";
import {AppStore, RootState, setupStore} from "../store.ts";
import React, {PropsWithChildren} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>
    store?: AppStore
}

export function renderWithProviders(
    ui: React.ReactElement,
    extendedRenderOptions: ExtendedRenderOptions = {}
) {
    const {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = extendedRenderOptions

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}><BrowserRouter>{children}</BrowserRouter></Provider>
    )

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions })
    }
}