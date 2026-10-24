import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import HomePage from '@/features/home/HomePage'
import CatalogPage from '@/features/catalog/CatalogPage'
import ProductDetailPage from '@/features/product/ProductDetailPage'
import SearchPage from '@/features/search/SearchPage'
import CartPage from '@/features/cart/CartPage'
import WishlistPage from '@/features/cart/WishlistPage'
import CheckoutPage from '@/features/checkout/CheckoutPage'
import CheckoutSuccessPage from '@/features/checkout/CheckoutSuccessPage'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/ResetPasswordPage'
import VerifyOtpPage from '@/features/auth/VerifyOtpPage'
import AccountLayout from '@/features/account/AccountLayout'
import AccountDashboardPage from '@/features/account/AccountDashboardPage'
import ProfilePage from '@/features/account/ProfilePage'
import AddressesPage from '@/features/account/AddressesPage'
import NotificationSettingsPage from '@/features/account/NotificationSettingsPage'
import SecurityPage from '@/features/account/SecurityPage'
import PaymentMethodsPage from '@/features/account/PaymentMethodsPage'
import OrderHistoryPage from '@/features/orders/OrderHistoryPage'
import OrderDetailsPage from '@/features/orders/OrderDetailsPage'
import MyReviewsPage from '@/features/account/MyReviewsPage'
import NotificationsPage from '@/features/notifications/NotificationsPage'
import HelpCenterPage from '@/features/help/HelpCenterPage'
import RaiseTicketPage from '@/features/help/RaiseTicketPage'
import AboutPage from '@/features/static/AboutPage'
import ContactPage from '@/features/static/ContactPage'
import PrivacyPolicyPage from '@/features/static/PrivacyPolicyPage'
import TermsPage from '@/features/static/TermsPage'
import RefundPolicyPage from '@/features/static/RefundPolicyPage'
import ShippingPolicyPage from '@/features/static/ShippingPolicyPage'
import CareersPage from '@/features/static/CareersPage'
import BlogPage from '@/features/static/BlogPage'
import NotFoundPage from '@/features/static/NotFoundPage'
import MaintenancePage from '@/features/static/MaintenancePage'
import ComingSoonPage from '@/features/static/ComingSoonPage'
import AdminDashboardPage from '@/features/admin/AdminDashboardPage'
import AdminProductsPage from '@/features/admin/products/AdminProductsPage'
import AdminProductFormPage from '@/features/admin/products/AdminProductFormPage'
import AdminCategoriesPage from '@/features/admin/categories/AdminCategoriesPage'
import AdminBrandsPage from '@/features/admin/brands/AdminBrandsPage'
import AdminOrdersPage from '@/features/admin/orders/AdminOrdersPage'
import AdminOrderDetailsPage from '@/features/admin/orders/AdminOrderDetailsPage'
import AdminInventoryPage from '@/features/admin/inventory/AdminInventoryPage'
import AdminUsersPage from '@/features/admin/users/AdminUsersPage'
import AdminCouponsPage from '@/features/admin/coupons/AdminCouponsPage'
import AdminReviewsPage from '@/features/admin/reviews/AdminReviewsPage'
import AdminReportsPage from '@/features/admin/reports/AdminReportsPage'
import AdminSettingsPage from '@/features/admin/settings/AdminSettingsPage'
import AdminSupportTicketsPage from '@/features/admin/support/AdminSupportTicketsPage'
import TicketDetailsPage from '@/features/help/TicketDetailsPage'



export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <CatalogPage /> },
      { path: 'category/:categorySlug', element: <CatalogPage /> },
      { path: 'brand/:brandSlug', element: <CatalogPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/success', element: <CheckoutSuccessPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'help', element: <HelpCenterPage /> },
      { path: 'help/ticket', element: <RaiseTicketPage /> },
      { path: 'help/tickets/:ticketId', element: <TicketDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-otp', element: <VerifyOtpPage /> },
      { path: 'verify-email', element: <Navigate to="/verify-otp" replace /> },
      {
  path: 'account',
  element: <AccountLayout />,
  children: [
    { index: true, element: <AccountDashboardPage /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'addresses', element: <AddressesPage /> },
    { path: 'orders', element: <OrderHistoryPage /> },
    { path: 'orders/:orderId', element: <OrderDetailsPage /> },
    { path: 'wishlist', element: <Navigate to="/wishlist" replace /> },
    { path: 'notifications', element: <NotificationSettingsPage /> },
    { path: 'security', element: <SecurityPage /> },
    { path: 'payment-methods', element: <PaymentMethodsPage /> },
    { path: 'reviews', element: <MyReviewsPage /> },
  ],
},
      { path: 'about', element: <AboutPage /> },
{ path: 'contact', element: <ContactPage /> },
{ path: 'privacy', element: <PrivacyPolicyPage /> },
{ path: 'terms', element: <TermsPage /> },
{ path: 'refund-policy', element: <RefundPolicyPage /> },
{ path: 'shipping-policy', element: <ShippingPolicyPage /> },
{ path: 'careers', element: <CareersPage /> },
{ path: 'blog', element: <BlogPage /> },
{ path: 'maintenance', element: <MaintenancePage /> },
{ path: 'coming-soon', element: <ComingSoonPage /> },
{ path: '*', element: <NotFoundPage /> },
    ],
  },
  
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:productId/edit', element: <AdminProductFormPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'brands', element: <AdminBrandsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/:orderId', element: <AdminOrderDetailsPage /> },
      { path: 'inventory', element: <AdminInventoryPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'coupons', element: <AdminCouponsPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
      { path: 'support-tickets', element: <AdminSupportTicketsPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
