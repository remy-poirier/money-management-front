import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import App from '@/App.tsx'
import { Signup } from '@/pages/session/signup/signup.tsx'
import { Home } from '@/pages/home/home.tsx'
import { ErrorPage } from '@/pages/error/error.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Signin } from '@/pages/session/signin/signin.tsx'
import { AdminRoute } from '@/conf/admin-route.tsx'
import { Users } from '@/pages/admin/users/users.tsx'
import { Dashboard } from '@/pages/dashboard/dashboard.tsx'
import { Transactions } from '@/pages/transactions/transactions.tsx'
import { LoggedRoute } from '@/conf/logged-route.tsx'
import { Onboarding } from '@/pages/user/onboarding.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'login',
        element: <Signin />,
      },
      {
        path: 'app',
        element: <LoggedRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'onboarding',
            element: <Onboarding />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'transactions',
            element: <Transactions />,
          },
          {
            path: 'admin',
            element: <AdminRoute />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: 'users',
                element: <Users />,
              },
            ],
          },
        ],
      },
    ],
  },
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
