export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
};

export const hasPermission = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

export const canManageTasks = (role) => {
  return [ROLES.ADMIN, ROLES.MANAGER].includes(role);
};

export const canManageUsers = (role) => {
  return role === ROLES.ADMIN;
};