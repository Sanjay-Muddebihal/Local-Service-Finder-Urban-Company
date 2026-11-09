import React from "react";
import { Route, Routes } from "react-router-dom";
import ReqAuth from "../Components/ReqAuth";
import Blog from "./Blog";
import Checkout from "./Checkout";
import Home from "./Home";
import LandingPage from "./LandingPage";
import ServicePage from "./ServicePage";
import Summary from "./Summary";
import ServiceFinder from "./ServiceFinder";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import MyBookings from "./MyBookings";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PaymentHistory from "./PaymentHistory";
import ProviderLogin from "./provider/ProviderLogin";
import ProviderDashboard from "./provider/ProviderDashboard";
import UserDashboard from "./user/UserDashboard";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<HomePage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/blog"    element={<Blog />} />

      {/* Protected */}
      <Route path="/find-services" element={<ReqAuth><ServiceFinder /></ReqAuth>} />
      <Route path="/my-bookings"   element={<ReqAuth><MyBookings /></ReqAuth>} />
      <Route path="/payment-history" element={<ReqAuth><PaymentHistory /></ReqAuth>} />

      {/* Admin */}
      <Route path="/admin"            element={<AdminLogin />} />
      <Route path="/admin/dashboard"  element={<AdminDashboard />} />

      {/* Provider */}
      <Route path="/provider"           element={<ProviderLogin />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />

      {/* User */}
      <Route path="/user/dashboard" element={<UserDashboard />} />

      {/* Checkout */}
      <Route path="/checkout" element={<ReqAuth><Checkout /></ReqAuth>} />

      {/* Legacy routes */}
      <Route path="/:city"                   element={<Home />} />
      <Route path="/:city/:id/services"      element={<ServicePage />} />
      <Route path="/:city/summary"           element={<Summary />} />
      <Route path="/:city/summary/checkout"  element={<ReqAuth><Checkout /></ReqAuth>} />
    </Routes>
  );
};

export default MainRoutes;
