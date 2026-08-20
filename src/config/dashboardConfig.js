// ✅ Central config for dashboard views.
// Two configs only: 'client' (everyone, default) and 'seller' (an
// UPGRADE on top of client — selected in Dashboard.jsx by checking
// user.sellerStatus === 'approved', not by a separate account type).
// Icon values are lucide-react component names (strings) — Dashboard.jsx
// maps these to the actual icon components.

export const getDashboardConfig = (view) => {
  switch (view) {

    case 'seller':
      return {
        tabs: [
          { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
          { id: 'myshop',   label: 'My Shop',  icon: 'Store' },
          { id: 'orders',   label: 'Orders',   icon: 'ShoppingCart' },
          { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
          { id: 'settings', label: 'Settings', icon: 'Settings' },
        ],
        stats: [
          { label: 'Products Listed', value: '0', icon: 'Store',         color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending Orders',  value: '0', icon: 'ShoppingCart',  color: 'bg-orange-50 text-orange-600' },
          { label: 'Messages',        value: '0', icon: 'MessageCircle', color: 'bg-green-50 text-green-600' },
          { label: 'Notifications',   value: '0', icon: 'Bell',          color: 'bg-purple-50 text-purple-600' },
        ],
        quickActions: [
          { label: 'Add a Product',    icon: 'Plus',          link: '/dashboard/add-product', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
          { label: 'View My Shop',     icon: 'Store',         link: '/shop/ultimate', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
          { label: 'Contact Support',  icon: 'MessageCircle', link: '/contact',       color: 'bg-gray-50 hover:bg-gray-100 text-gray-700' },
        ],
      }

    case 'client':
    default:
      return {
        tabs: [
          { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
          { id: 'projects', label: 'Projects', icon: 'Briefcase' },
          { id: 'orders',   label: 'Orders',   icon: 'ShoppingCart' },
          { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
          { id: 'settings', label: 'Settings', icon: 'Settings' },
        ],
        stats: [
          { label: 'Active Projects', value: '0', icon: 'Briefcase',      color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending Orders',  value: '0', icon: 'ShoppingCart',   color: 'bg-orange-50 text-orange-600' },
          { label: 'Messages',        value: '0', icon: 'MessageCircle',  color: 'bg-green-50 text-green-600' },
          { label: 'Notifications',   value: '0', icon: 'Bell',           color: 'bg-purple-50 text-purple-600' },
        ],
        quickActions: [
          { label: 'Request a Service', icon: 'Briefcase',      link: '/contact', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
          { label: 'Browse Shop',       icon: 'ShoppingCart',   link: '/shop',    color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
          { label: 'Read Blog',         icon: 'FileText',       link: '/blog',    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
          { label: 'Contact Support',   icon: 'MessageCircle',  link: '/contact', color: 'bg-gray-50 hover:bg-gray-100 text-gray-700' },
          { label: 'View Portfolio',    icon: 'Palette',        link: '/portfolio', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
        ],
      }
  }
}