import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "./store";

import ErrorBoundary from "./components/UI/ErrorBoundary";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import Notification from "./components/UI/Notification";

import LoginForm from "./components/Auth/LoginForm";
import LogoutButton from "./components/Auth/LogoutButton";

import Toolbar from "./components/UI/Toolbar";
import FormattingToolbar from "./components/BonusFeatures/FormattingToolbar";
import CollaborationPanel from "./components/Collaboration/CollaborationPanel";
import GridContainer from "./components/Grid/GridContainer";
import StatusBar from "./components/UI/StatusBar";

import CSVImportExport from "./components/BonusFeatures/CSVImportExport";
import UndoRedo from "./components/BonusFeatures/UndoRedo";
import ChartGenerator from "./components/BonusFeatures/ChartGenerator";
import RowColumnMenu from "./components/Operations/RowColumnMenu";
import MultipleSheets from "./components/BonusFeatures/MultipleSheets";
import FormulaBar from "./components/Formula/FormulaBar";
import ContextMenu from "./components/Operations/ContextMenu";
import CopyPasteHandler from "./components/Operations/CopyPasteHandler";

import { useAuth } from "./hooks/useAuth";
import useGridNavigation from "./hooks/useGridNavigation";
import { useWebSocketConnection } from "./hooks/useWebSocket";
import useSheetSync from "./hooks/useSheetSync";
import { addSheet, deleteSheet, switchSheet } from "./store/sheetsSlice";

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { user, status, restore } = useAuth();
  const isLoading = useSelector((state: RootState) => state.ui.loading);
  
  // Get sheets data from Redux store
  const { sheets, activeSheetId } = useSelector((state: RootState) => state.sheets);

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState({
    visible: false,
    x: 0,
    y: 0
  });

  const handleChangeSheet = (sheetId: string) => {
    dispatch(switchSheet(sheetId));
  };

  const handleAddSheet = () => {
    dispatch(addSheet({}));
  };

  const handleDeleteSheet = (sheetId: string) => {
    dispatch(deleteSheet(sheetId));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleContextMenuAction = (action: string) => {
    console.log('Context menu action:', action);
    // Handle context menu actions here
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Initialize grid navigation
  useGridNavigation();

  // Initialize sheet synchronization
  useSheetSync();

  // Initialize WebSocket connection for real-time collaboration
  useWebSocketConnection(activeSheetId);

  // Restore session on mount (if token present)
  // This will run only once when the component mounts
  useEffect(() => {
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") return <LoadingSpinner />;

  if (!user) {
    // User not authenticated, show login form only
    return (

      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-gray-100 px-4">
        <div className="max-w-sm w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          {/* <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">Spreadsheet Application</h1>
            <p className="text-gray-600">Enter your credentials to access your spreadsheets</p>
          </div> */}
          <LoginForm />
        </div>
        <div className="mt-8 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Spreadsheet App. All rights reserved.
        </div>
      </div>
    );
  }

  // Authenticated UI
  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 shadow-sm select-none">
        <div className="flex items-center space-x-3">
          <div className="text-blue-700 font-bold text-lg">Spreadsheet App</div>
          <LogoutButton />
        </div>
        <div className="text-sm text-gray-600">
          Signed in as <span className="font-semibold">{user.username}</span>
        </div>
      </div>

      {/* Multiple Sheets Tabs */}
      <MultipleSheets 
        sheets={sheets}
        activeSheetId={activeSheetId}
        onChangeSheet={handleChangeSheet}
        onAddSheet={handleAddSheet}
        onDeleteSheet={handleDeleteSheet}
      />

      {/* Toolbar and Formula Bar */}
      <Toolbar />
      <FormulaBar />
      <FormattingToolbar />

      {/* Collaboration Panel */}
      <CollaborationPanel />

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 p-4 bg-gray-50 overflow-y-auto space-y-6">
          <RowColumnMenu />
          <CSVImportExport />
          <UndoRedo />
          <ChartGenerator />
        </aside>

        <section className="flex-1 flex flex-col overflow-hidden" onContextMenu={handleContextMenu}>
          <GridContainer />
        </section>
      </main>

      {/* Status Bar */}
      <StatusBar />

      {/* Utility Components */}
      <CopyPasteHandler />
      <ContextMenu 
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onAction={handleContextMenuAction}
        onClose={handleCloseContextMenu}
      />

      {isLoading && <LoadingSpinner />}
      <Notification />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
