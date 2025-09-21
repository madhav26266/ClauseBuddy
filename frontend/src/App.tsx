import { useState, useEffect } from "react";
import StarField from "./components/StarField";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import History from "./components/History";
import Uploads from "./components/Uploads";
import RightPanel from "./components/RightPanel";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";


function AppContent() {
  const { user, loading, login } = useAuth();
  const [activeSection, setActiveSection] = useState("chat");
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Track section changes to trigger uploads refresh
  const [sectionChangeKey, setSectionChangeKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onSuccess={(token, userData) => {
      login(token, userData);
    }} />;
  }

  // normal app UI after login
  const renderMainContent = () => {
    switch (activeSection) {
      case "chat":
        return <Chat />;
      case "history":
        return <History onSectionChange={setActiveSection} />;
      case "uploads":
        return <Uploads key={sectionChangeKey} />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-black text-white dark relative">
      {/* Animated Star Background */}
      <StarField />

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setSectionChangeKey(prev => prev + 1);
        }}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
        onLoginClick={() => {}}
      />

      {/* Main Content Area */}
      <div className="relative z-1">
        <div
          className={`
          transition-all duration-300
          ${isSidebarCollapsed ? "ml-16" : "ml-64"}
          ${activeSection === "chat" && isRightPanelExpanded ? "mr-96" : "mr-0"}
          ${activeSection === "chat" ? "mr-12" : "mr-0"}
        `}
        >
          <div
            className={`
            p-6
            ${activeSection === "chat" ? "h-screen flex flex-col" : "min-h-screen"}
          `}
          >
            {activeSection === "chat" ? (
              <div className="flex-1 h-full bg-black/20 backdrop-blur-sm rounded-lg border border-purple-900/30 overflow-hidden min-h-0">
                <Chat />
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Only show for chat */}
      {activeSection === "chat" && (
        <RightPanel
          isExpanded={isRightPanelExpanded}
          onToggle={() => setIsRightPanelExpanded(!isRightPanelExpanded)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
