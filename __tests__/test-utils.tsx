import { render, type RenderOptions } from "@testing-library/react"
import * as React from "react"

import { AppStoreProvider } from "@/context/app-store"

function AllProviders({ children }: { children: React.ReactNode }) {
  return <AppStoreProvider>{children}</AppStoreProvider>
}

function renderWithProvider(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export { renderWithProvider }
export * from "@testing-library/react"
