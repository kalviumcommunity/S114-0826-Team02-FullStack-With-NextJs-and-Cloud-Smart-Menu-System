import { useState } from "react";
import type { Screen } from "./types";
import Sidebar from "./components/sidebar";
import DashboardScreen from "./pages/dashboard";
import MenuScreen from "./pages/menu";
import PricingScreen from "./pages/pricing";
import InventoryScreen from "./pages/inventory";
import ActivityScreen from "./pages/activity";
import CustomerScreen from "./pages/customerservice";

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const renderScreen = () => {
    switch (screen) {
      case "dashboard": return <DashboardScreen />;
      case "menu": return <MenuScreen onPricing={() => setScreen("pricing")} />;
      case "pricing": return <PricingScreen />;
      case "inventory": return <InventoryScreen />;
      case "activity": return <ActivityScreen />;
      case "customer": return <CustomerScreen />;
    }
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Sidebar active={screen} onNav={setScreen} />
      {renderScreen()}
    </div>
  );
}
