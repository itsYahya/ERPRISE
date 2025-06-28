import { useLocation } from 'react-router-dom';
import { Breadcrumbs as HeroBreadcrumbs, BreadcrumbItem } from '@heroui/react';
import { HiHome } from 'react-icons/hi';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map routes to readable names
  const routeNames = {
    customers: 'Customers',
    employees: 'Employees',
    users: 'Users',
    products: 'Products',
    'add-customer': 'Add Customer',
    'add-employee': 'Add Employee',
    'add-user': 'Add User',
    'add-product': 'Add Product',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    payroll: 'Payroll',
    settings: 'Settings',
    'roles-permissions': 'Roles & Permissions',
  };

  const items = [
    {
      href: '/',
      label: 'Home',
      icon: HiHome,
      current: pathnames.length === 0
    },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      return {
        href: !isLast ? routeTo : undefined,
        label: routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1),
        current: isLast
      };
    })
  ];

  return (
    <HeroBreadcrumbs>
      {items.map((item, index) => (
        <BreadcrumbItem
          key={item.href || index}
          href={item.href}
          current={item.current}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </HeroBreadcrumbs>
  );
};

export default Breadcrumbs;
