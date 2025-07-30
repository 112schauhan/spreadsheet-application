import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { WebSocketProvider } from '../contexts/WebSocketContext'

// Custom render function that includes Redux Provider and WebSocketProvider
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <WebSocketProvider sheetId="test-sheet">
        {children}
      </WebSocketProvider>
    </Provider>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export testing utilities
export { customRender as render }
export { screen, fireEvent, waitFor, act } from '@testing-library/react'
