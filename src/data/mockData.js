export const HQ = 'Head Office'

export const ROLES = ['Super Admin', 'Admin', 'General Manager', 'Branch Manager', 'Clerk', 'Cashier', 'Sales Officer']
export const HQ_ROLES = ['Super Admin', 'Admin', 'General Manager']

export const ROLE_TONE = {
  'Super Admin': 'er', 'Admin': 'in', 'General Manager': 'in',
  'Branch Manager': 'ok', 'Clerk': 'gy', 'Cashier': 'wn', 'Sales Officer': 'ok',
}

export const ROLE_DESC = {
  'Super Admin': 'Full access to everything',
  'Admin': 'Runs daily administration for the head office',
  'General Manager': 'Oversees all branches and approvals',
  'Branch Manager': 'Runs one branch',
  'Clerk': 'Data entry in a branch',
  'Cashier': 'Handles cash in a branch',
  'Sales Officer': 'Field sales and customer acquisition',
}

export const PERMISSION_GROUPS = {
  Masters: ['View Masters', 'Manage Masters'],
  Customers: ['View Customers', 'Create Customers', 'Edit Customers'],
  Deposits: ['Open Deposit', 'Close Deposit', 'Cash Receipt'],
  Loans: ['Loan Application', 'Approve Loan', 'Disburse Loan', 'Loan Receipt'],
  Accounts: ['Journal Entry', 'Cash Payment', 'Bank Entry'],
  Reports: ['View Reports', 'Export Reports'],
  Administration: ['Manage Branches', 'Manage Staff', 'Manage Roles', 'Manage Admins'],
}
export const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat()

export const initialBranches = [
  { code: 'BR-01', name: 'Rampur Branch', area: 'Rampur', district: 'Rangareddy', opened: '15 Mar 2022', status: 'Active' },
  { code: 'BR-02', name: 'Kondapur Branch', area: 'Kondapur', district: 'Sangareddy', opened: '02 Aug 2022', status: 'Active' },
  { code: 'BR-03', name: 'Shankarpally Branch', area: 'Shankarpally', district: 'Rangareddy', opened: '10 Jan 2023', status: 'Active' },
  { code: 'BR-04', name: 'Medchal Branch', area: 'Medchal', district: 'Medchal', opened: '21 Jun 2023', status: 'Active' },
]

const u = (id, name, mail, mobile, role, location, status = 'Active') => ({
  id, name, email: `${mail}@ruralfinance.bank`, mobile, role, location, status,
})

export const initialUsers = [
  u('U-001', 'Srithajana', 'srithajana', '98480 00001', 'Super Admin', HQ),
  u('U-002', 'Arjun Mehta', 'arjun', '98480 00002', 'Admin', HQ),
  u('U-003', 'Divya Nair', 'divya', '98480 00003', 'Admin', HQ),
  u('U-004', 'Karan Shah', 'karan', '98480 00004', 'General Manager', HQ),
  u('U-005', 'Ravi Kumar', 'ravi', '98490 11223', 'Branch Manager', 'Rampur Branch'),
  u('U-006', 'Anita Reddy', 'anita', '98490 44556', 'Branch Manager', 'Kondapur Branch'),
  u('U-007', 'Lata Devi', 'lata', '98490 55667', 'Clerk', 'Rampur Branch'),
  u('U-008', 'Suresh Goud', 'suresh', '98490 77889', 'Cashier', 'Shankarpally Branch'),
  u('U-009', 'Meena Rao', 'meena', '98490 99001', 'Sales Officer', 'Medchal Branch'),
  u('U-010', 'Prakash Rao', 'prakash', '98490 22334', 'Sales Officer', 'Kondapur Branch', 'Inactive'),
]

export const initialRolePermissions = {
  'Super Admin': [...ALL_PERMISSIONS],
  'Admin': ALL_PERMISSIONS.filter((p) => p !== 'Manage Admins' && p !== 'Manage Roles'),
  'General Manager': ['View Masters', 'View Customers', 'Approve Loan', 'Loan Application', 'View Reports', 'Export Reports', 'Journal Entry'],
  'Branch Manager': ['View Masters', 'View Customers', 'Create Customers', 'Edit Customers', 'Open Deposit', 'Close Deposit', 'Loan Application', 'Approve Loan', 'Disburse Loan', 'View Reports', 'Manage Staff'],
  'Clerk': ['View Customers', 'Create Customers', 'Open Deposit', 'Loan Application', 'Journal Entry'],
  'Cashier': ['View Customers', 'Cash Receipt', 'Loan Receipt', 'Cash Payment'],
  'Sales Officer': ['View Customers', 'Create Customers', 'Loan Application', 'View Reports'],
}

export const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '')