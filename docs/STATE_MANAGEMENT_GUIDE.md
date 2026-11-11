# State Management & Context Architecture Guide

This document explains the global state management architecture of the FCAI BSU Education Platform.

---

## 1. Principles of State Management in this Project

1. **Keep Global State Minimal**:
   - Only state that is genuinely shared across different pages/layouts belongs in a React Context.
   - Page-specific data (e.g. form fields, search filter strings, modal open/close toggles, single-page tables) should remain in local component state (`useState`, `useReducer`).
2. **Dedicated, Focused Providers**:
   - We avoid a monolithic "everything" context.
   - Presentation layout state (`UIContext`) is decoupled from authentication session state (`AuthContext`), which is decoupled from notifications (`NotificationContext`) and student academic enrollment (`AcademicContext`).
3. **Optimistic Updates with Error Rollback**:
   - For fast, modern UX (e.g. marking notification read, toggling sidebar), update UI state immediately, then invoke the backend API in the background.

---

## 2. Context Providers Overview

| Context | Hook | Primary Responsibility | File Location |
| :--- | :--- | :--- | :--- |
| **UIContext** | `useUI()` | Theme mode (light/dark), sidebar collapsed, mobile drawer, toast queue | `src/context/UIContext.tsx` |
| **AuthContext** | `useAuth()` | Authenticated user profile, active role, JWT session, login/logout | `src/context/AuthContext.tsx` |
| **NotificationContext** | `useNotifications()` | User notifications inbox, unread badge counter, mark read | `src/context/NotificationContext.tsx` |
| **AcademicContext** | `useAcademic()` | Student enrolled courses, active registration window, drop/add actions | `src/context/AcademicContext.tsx` |

All providers are mounted together in the root wrapper component **`AppProviders`** (`src/context/index.tsx`) in `src/App.tsx`.

---

## 3. How to Use Each Context

### 3.1 `useUI()` — Layout, Themes & Toasts

```tsx
import { useUI } from '../context/UIContext';

export const MyComponent = () => {
  const { theme, toggleTheme, showToast, isSidebarCollapsed, toggleSidebar } = useUI();

  const handleAction = () => {
    showToast('Success', 'Profile updated successfully!', 'success');
  };

  return (
    <button onClick={toggleTheme}>
      Current Mode: {theme}
    </button>
  );
};
```

---

### 3.2 `useAuth()` — Identity, Role & Authentication

```tsx
import { useAuth } from '../context/AuthContext';

export const UserBadge = () => {
  const { currentUser, role, isAuthenticated, logout, switchRole } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <a href="#/login">Sign In</a>;
  }

  return (
    <div>
      <span>{currentUser.name}</span>
      <span className="badge">{role.toUpperCase()}</span>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};
```

#### How to connect `AuthContext` to your real backend:
Open `src/context/AuthContext.tsx` and locate the `login` function:
```ts
// In src/context/AuthContext.tsx:
const login = async (credentials: LoginRequest) => {
  setIsLoadingUser(true);
  try {
    // 1. Call your real API function:
    const res = await authApi.login(credentials);
    
    // 2. Set tokens and user state:
    tokenStorage.set(res.token);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    setRoleState(res.user.role);
    return res.user;
  } finally {
    setIsLoadingUser(false);
  }
};
```

---

### 3.3 `useNotifications()` — Inbox & Badges

```tsx
import { useNotifications } from '../context/NotificationContext';

export const NotificationBadge = () => {
  const { unreadCount, notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();

  return (
    <div className="relative">
      <button>Bell Icon</button>
      {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
      
      {notifications.map(item => (
        <div key={item.id} onClick={() => markAsRead(item.id)}>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 3.4 `useAcademic()` — Student Courses & Registration

```tsx
import { useAcademic } from '../context/AcademicContext';

export const QuickCourseWidget = () => {
  const { enrolledCourses, isLoadingAcademic, dropCourse } = useAcademic();

  return (
    <div>
      <h4>Active Courses ({enrolledCourses.length})</h4>
      {enrolledCourses.map(c => (
        <div key={c.id}>
          <span>{c.code} · {c.name}</span>
          <button onClick={() => dropCourse(c.id)}>Drop</button>
        </div>
      ))}
    </div>
  );
};
```

---

## 4. When to Use Context vs Local Component State

| Use Case | State Location | Example |
| :--- | :--- | :--- |
| Logged-in user profile, role, avatar | **AuthContext** | Displayed in Topbar, Sidebar, Profile |
| Theme toggle (light/dark) | **UIContext** | Sets `data-theme` attribute on `<html>` |
| Unread notifications badge count | **NotificationContext**| Displayed in Topbar and Notifications Page |
| Active enrolled courses count | **AcademicContext** | Topbar chip and Dashboard courses widget |
| Search bar text input | **Local Component** | `const [query, setQuery] = useState('')` |
| Table page number / pagination | **Local Component** | `const [page, setPage] = useState(1)` |
| Modal open / close toggle | **Local Component** | `const [isOpen, setIsOpen] = useState(false)` |
| Form draft data | **Local Component** | `const [formData, setFormData] = useState({...})` |
