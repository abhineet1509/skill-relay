import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./layouts/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { TechnicianRegister } from "./pages/TechnicianRegister";
import { ForgotPassword } from "./pages/ForgotPassword";
import { TechnicianList } from "./pages/TechnicianList";
import { TechnicianProfile } from "./pages/TechnicianProfile";
import { TechnicianDashboard } from "./pages/TechnicianDashboard";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="technician-register" element={<TechnicianRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="technicians" element={<TechnicianList />} />
            <Route path="technician/:id" element={<TechnicianProfile />} />
            
                        
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="profile" element={<CustomerDashboard />} />
              <Route path="services" element={<CustomerDashboard />} />
              <Route path="appliances" element={<CustomerDashboard />} />
              <Route path="customer/dashboard" element={<CustomerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
              <Route path="technician/dashboard" element={<TechnicianDashboard />} />
            </Route>
            
            
          </Route>
        </Routes>
              </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;





