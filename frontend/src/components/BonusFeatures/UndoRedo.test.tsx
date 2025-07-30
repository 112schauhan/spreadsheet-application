import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
import UndoRedo from './UndoRedo'
import { store } from '../../store'
import { updateCellWithHistory } from '../../store/gridSlice'
import { undo } from '../../store/historySlice'
import userEvent from '@testing-library/user-event'

describe('UndoRedo Component', () => {
  beforeEach(() => {
    // Reset store state
    store.dispatch({ type: 'history/clearHistory' })
    store.dispatch({ type: 'grid/resetGrid' })
  })

  it('renders undo and redo buttons', () => {
    render(<UndoRedo />)
    
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
  })

  it('disables undo button when no history', () => {
    render(<UndoRedo />)
    
    const undoButton = screen.getByText('Undo')
    expect(undoButton).toBeDisabled()
  })

  it('disables redo button when no future history', () => {
    render(<UndoRedo />)
    
    const redoButton = screen.getByText('Redo')
    expect(redoButton).toBeDisabled()
  })

  it('enables undo button after cell update', async () => {
    render(<UndoRedo />)
    
    // Make a change to add to history
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'test' }))
    
    await waitFor(() => {
      const undoButton = screen.getByText('Undo')
      expect(undoButton).not.toBeDisabled()
    })
  })

  it('handles undo action when button is clicked', async () => {
    const user = userEvent.setup()
    render(<UndoRedo />)
    
    // Make a change
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'test' }))
    
    await waitFor(() => {
      const undoButton = screen.getByText('Undo')
      expect(undoButton).not.toBeDisabled()
    })
    
    const undoButton = screen.getByText('Undo')
    await user.click(undoButton)
    
    // Check that undo action was dispatched
    await waitFor(() => {
      const state = store.getState()
      expect(state.history.past.length).toBe(0)
    })
  })

  it('handles redo action when button is clicked', async () => {
    const user = userEvent.setup()
    render(<UndoRedo />)
    
    // Make a change and then undo it
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'test' }))
    store.dispatch(undo())
    
    await waitFor(() => {
      const redoButton = screen.getByText('Redo')
      expect(redoButton).not.toBeDisabled()
    })
    
    const redoButton = screen.getByText('Redo')
    await user.click(redoButton)
    
    // Check that redo action was dispatched
    await waitFor(() => {
      const state = store.getState()
      expect(state.history.future.length).toBe(0)
    })
  })

  it('shows proper button states during history navigation', async () => {
    render(<UndoRedo />)
    
    const undoButton = screen.getByText('Undo')
    const redoButton = screen.getByText('Redo')
    
    // Initial state - both disabled
    expect(undoButton).toBeDisabled()
    expect(redoButton).toBeDisabled()
    
    // After change - undo enabled, redo disabled
    await store.dispatch(updateCellWithHistory({ cellRef: 'A1', value: 'test' }))
    
    await waitFor(() => {
      expect(undoButton).not.toBeDisabled()
      expect(redoButton).toBeDisabled()
    })
    
    // After undo - undo disabled, redo enabled
    store.dispatch(undo())
    
    await waitFor(() => {
      expect(undoButton).toBeDisabled()
      expect(redoButton).not.toBeDisabled()
    })
  })

  it('applies correct styling to disabled buttons', () => {
    render(<UndoRedo />)
    
    const undoButton = screen.getByText('Undo')
    const redoButton = screen.getByText('Redo')
    
    expect(undoButton).toHaveClass('disabled:opacity-50')
    expect(undoButton).toHaveClass('disabled:cursor-not-allowed')
    expect(redoButton).toHaveClass('disabled:opacity-50')
    expect(redoButton).toHaveClass('disabled:cursor-not-allowed')
  })
})
