import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
import Cell from './Cell'
import { store } from '../../store'
import { updateCellWithHistory } from '../../store/gridSlice'
import { selectCell } from '../../store/selectionSlice'
import userEvent from '@testing-library/user-event'

// Helper function to get cell element
const getCellElement = (cellRef: string) => {
  return document.querySelector(`[data-cell="${cellRef}"]`) as HTMLElement
}

describe('Cell Component', () => {
  const defaultProps = {
    cellRef: 'A1',
    style: { width: 100, height: 30 }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear any existing cell data and reset store state
    store.dispatch({ type: 'grid/resetGrid' })
    store.dispatch({ type: 'selection/clearSelection' })
    store.dispatch({ type: 'history/clearHistory' })
  })

  it('renders cell element with correct attributes', () => {
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    expect(cellElement).toBeInTheDocument()
    expect(cellElement).toHaveAttribute('data-cell', 'A1')
    expect(cellElement).toHaveAttribute('tabindex', '0')
  })

  it('displays cell value when present', async () => {
    // Add cell data to store using async thunk
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'Test Value' }))
    
    render(<Cell {...defaultProps} />)
    
    await waitFor(() => {
      const cellElement = getCellElement('A1')
      expect(cellElement).toHaveTextContent('Test Value')
    })
  })

  it('handles cell click and updates selection', async () => {
    const user = userEvent.setup()
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    await user.click(cellElement)
    
    // Check that selection was updated in store
    await waitFor(() => {
      const state = store.getState()
      expect(state.selection.selectedCell).toBe('A1')
    })
  })

  it('enters edit mode on double-click', async () => {
    const user = userEvent.setup()
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    await user.dblClick(cellElement)
    
    // Should show input element when editing
    await waitFor(() => {
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('w-full', 'h-full', 'px-1')
    })
  })

  it('shows selected styling when cell is selected', () => {
    // Select the cell using proper action
    store.dispatch(selectCell({ cellRef: 'A1' }))
    
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    expect(cellElement).toHaveClass('outline-blue-500')
  })

  it('displays formula in input when editing cell with formula', async () => {
    const user = userEvent.setup()
    
    // Set up cell with formula
    await store.dispatch(updateCellWithHistory({ 
      cellRef: 'A1', 
      value: 10, 
      formula: '=SUM(B1:B5)' 
    }))
    
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    await user.dblClick(cellElement)
    
    // Should show formula in input, not the calculated value
    await waitFor(() => {
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('=SUM(B1:B5)')
    })
  })

  it('saves input value on Enter key', async () => {
    const user = userEvent.setup()
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    await user.dblClick(cellElement)
    
    // Wait for edit mode
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'New Content')
    await user.keyboard('{Enter}')
    
    // Should exit edit mode and show new content
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(cellElement).toHaveTextContent('New Content')
    })
  })

  it('cancels edit on Escape key and restores original value', async () => {
    const user = userEvent.setup()
    
    // Set initial value
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'Original' }))
    
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    await user.dblClick(cellElement)
    
    // Wait for edit mode
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Changed Content')
    await user.keyboard('{Escape}')
    
    // Should exit edit mode and restore original value
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(cellElement).toHaveTextContent('Original')
    })
  })

  it('displays numeric values correctly', async () => {
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 42 }))
    
    render(<Cell {...defaultProps} />)
    
    await waitFor(() => {
      const cellElement = getCellElement('A1')
      expect(cellElement).toHaveTextContent('42')
    })
  })

  it('handles empty cells correctly', () => {
    render(<Cell {...defaultProps} />)
    
    const cellElement = getCellElement('A1')
    // Empty cell should have empty text content
    expect(cellElement).toHaveTextContent('')
  })
})
