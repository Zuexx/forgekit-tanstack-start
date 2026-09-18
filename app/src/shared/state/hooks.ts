import { useShallow } from 'zustand/react/shallow'

import { useAppStoreContext } from './state-provider'

export const useUser = () =>
  useAppStoreContext(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      setUser: state.setUser,
      updateUser: state.updateUser,
      logout: state.logout,
    })),
  )

export const useUI = () =>
  useAppStoreContext(
    useShallow((state) => ({
      theme: state.theme,
      sidebarOpen: state.sidebarOpen,
      loading: state.loading,
      setTheme: state.setTheme,
      toggleSidebar: state.toggleSidebar,
      setSidebarOpen: state.setSidebarOpen,
      setLoading: state.setLoading,
    })),
  )

export const useTheme = () => useAppStoreContext((state) => state.theme)
export const useSidebarOpen = () =>
  useAppStoreContext((state) => state.sidebarOpen)
export const useLoading = () => useAppStoreContext((state) => state.loading)
export const useIsAuthenticated = () =>
  useAppStoreContext((state) => state.isAuthenticated)
