import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CardHistoryPage } from "./pages/CardHistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AddCardModal } from "./components/forms/AddCardModal";
import { EditCardModal } from "./components/forms/EditCardModal";
import { QuickTransactionModal } from "./components/forms/QuickTransactionModal";
import { DeleteConfirmationModal } from "./components/forms/DeleteConfirmationModal";

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Защищённые маршруты */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="card-history/:cardId" element={<CardHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      {/* Модальные окна */}
      <AddCardModal />
      <EditCardModal />
      <QuickTransactionModal />
      <DeleteConfirmationModal />
    </Router>
  );
}

export default App;
