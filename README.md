# 🍽️ Restaurant Management System - Frontend

**Status:** Production Ready (68% Complete)  
**Technology:** React + TypeScript + Vite + Redux + Ant Design + TailwindCSS  
**Backend API:** https://localhost:7208/api

---

## 📚 DOCUMENTATION FILES

### **Start Here:**
- 📖 **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Quick start, implementation status, task checklist
- 📋 **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Detailed task list with time estimates
- 🔗 **[FRONTEND_SPECIFICATION.md](./FRONTEND_SPECIFICATION.md)** - Full API documentation & specifications

---

## 🚀 QUICK START

### Setup:
```bash
npm install
npm run dev                 # Start dev server at localhost:5173
```

### Build:
```bash
npm run build              # Create production build
npm run preview            # Preview build locally
npm run lint               # Check code quality
```

---

## ✅ CURRENT STATUS

**Completed (68%):**
- ✅ Authentication system (Login, Register, JWT)
- ✅ Admin dashboard & all management pages
- ✅ Menu, Staff, Orders, Tables, Feedback, Payments management
- ✅ Redux state management
- ✅ Role-based access control (Admin, Staff)
- ✅ Public pages (Home, Header, Footer)

**Missing (32%):**
- ❌ Customer order history page
- ❌ Customer payment history page
- ❌ Customer profile/settings page
- ❌ Customer reservations page
- ❌ Customer feedback page
- ❌ Staff dashboard
- ❌ Customer permission enforcement (BUG)
- ❌ 7 UI components

**See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for detailed breakdown.**

---

## 🔐 USER ROLES

### **Admin** ✅ Fully Implemented
- Access all management pages
- Full CRUD operations
- View statistics and analytics
- Manage staff and users

### **Staff** ✅ Fully Implemented
- Manage menu items
- View/manage orders
- Manage tables
- View payments (read-only)
- Access staff dashboard

### **Customer** ❌ Not Implemented
- Need to implement order history, payments, profile, reservations, feedback pages
- Currently can incorrectly access admin pages (BUG)

---

## 📁 PROJECT STRUCTURE

```
src/
├── pages/               # React pages
│   ├── admin/          ✅ All CRUD pages
│   ├── auth/           ✅ Login, Register
│   ├── customer/       ✅ EMPTY (needs 5 pages)
│   ├── staff/          ✅ EMPTY (needs 1 page)
│   ├── home/           ✅ Public pages
│   └── errors/         ✅ 404, 403 pages
├── components/          # Reusable components
├── services/            # Business logic layer (9/10 implemented)
├── redux/              # Redux store & slices
├── utils/
│   ├── api/            # API endpoints
│   └── axios.ts        # HTTP client
├── types/              # TypeScript interfaces
├── guards/             # Route guards
├── layouts/            # Header, Footer, AppLayout
└── config/             # Routes configuration
```

---

## 🎯 NEXT TASKS (Priority Order)

1. **[CRITICAL] Fix Customer Permission Bug** (30 min)
   - File: `src/guards/AuthGuard.tsx`
   - Issue: Customers can access admin pages

2. **[HIGH] Create Customer Order Page** (4 hours)
   - File: `src/pages/customer/CustomerOrderPage.tsx`
   - Route: `/customer/orders`

3. **[HIGH] Create Customer Payment Page** (3 hours)
   - File: `src/pages/customer/CustomerPaymentPage.tsx`
   - Route: `/customer/payments`

4. **[HIGH] Create Customer Profile Page** (3 hours)
   - File: `src/pages/customer/CustomerProfilePage.tsx`
   - Route: `/profile`

**See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed instructions.**

---

## 🔧 DEVELOPMENT

### API Endpoints:
- Authentication: `/api/auth/*`
- Orders: `/api/order`
- Payments: `/api/payment`
- Menu: `/api/menu-item`
- Tables: `/api/restaurant-table`
- Staff: `/api/staff`
- Feedback: `/api/feedback`

**Full API docs:** See [FRONTEND_SPECIFICATION.md](./FRONTEND_SPECIFICATION.md)

### Environment Variables (.env):
```
VITE_API_URL=https://localhost:7208/api
VITE_GOOGLE_CLIENT_ID=375372196895-cs2d24oqsackj8vvn959akbhit88lh3a.apps.googleusercontent.com
```

---

## ✨ KEY FEATURES

### Authentication ✅
- JWT token management
- Role-based access control
- Protected routes
- Auto-logout on token expiry

### Admin Dashboard ✅
- Menu management (CRUD)
- Staff management (CRUD)
- Order management (View, Search, Cancel)
- Payment management (View, Update status)
- Table management (CRUD, Reservations)
- Feedback management (View, Approve, Reply)

### Customer Features ❌ (To Build)
- Order history with search
- Payment history with receipts
- Profile management
- Table reservations
- Feedback & reviews

---

## 🧪 TESTING

### Before submitting changes:
```bash
npm run lint              # Check code quality
npm run build             # Build for production
```

### Test checklist:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Permissions properly enforced
- [ ] All CRUD operations working
- [ ] Data privacy protected
- [ ] Error messages user-friendly
- [ ] Mobile responsive

---

## 📚 RESOURCES

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Redux: https://redux.js.org
- Ant Design: https://ant.design
- Vite: https://vite.dev

---

## 📝 NOTES

- Backend API: Requires .NET backend running on localhost:7208
- Database: PostgreSQL (backend managed)
- State Management: Redux Toolkit with async thunks
- HTTP Client: Axios with JWT interceptor
- UI Components: Ant Design 5 + TailwindCSS

---

## 👨‍💻 DEVELOPMENT GUIDELINES

1. Follow existing code patterns (copy from MenuManagementPage)
2. Always check user role before showing features
3. Filter data by userId for customer data
4. Use TypeScript strict mode (no `any`)
5. Add loading states for async operations
6. Handle errors with user-friendly messages
7. Write code in Vietnamese comments where applicable
8. Test all features on all user roles

---

**Questions?** Reference [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) or [FRONTEND_SPECIFICATION.md](./FRONTEND_SPECIFICATION.md)

**Current Progress:** 68% Complete → **Target:** 100%

Happy coding! 🚀
