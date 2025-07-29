import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import { clearConflict } from "../../store/collaborationSlice"; // Adjust path if needed

const ConflictResolution: React.FC = () => {
  const conflicts = useSelector((state: RootState) => state.collaboration.conflicts);
  const dispatch = useDispatch();

  const conflictedCells = Object.entries(conflicts).filter(([, isConflict]) => isConflict);

  if (conflictedCells.length === 0) return null;

  const handleResolve = (cellRef: string) => {
    // Here we dispatch an action to clear conflict on this cell.
    dispatch(clearConflict(cellRef));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {conflictedCells.map(([cellRef]) => (
        <div
          key={cellRef}
          className="flex items-center justify-between p-3 bg-red-100 border border-red-400 rounded shadow"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-red-800 font-semibold text-sm">
            Conflict detected at <strong>{cellRef}</strong>
          </p>
          <button
            onClick={() => handleResolve(cellRef)}
            className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
};

export default ConflictResolution;
