import { create } from "zustand"

export const useGeneral = create((set) => ({
    overlayVisible: false,
    setOverlayVisible: (state) => set({ overlayVisible: state })
}))

export const useAuth = create((set) => ({
    auth: true,
    setAuth: (state) => set({ auth: state })
}))

export const useProduct = create((set) => ({
    products: [],
    setProducts: (updater) =>
        set((state) => ({
            products: typeof updater === 'function' ? updater(state.products) : updater
        }))
}))

export const UseTextInput = create((set) => ({
    textInput: "",
    setTextInput: (state) => set({ textInput: state })
}))

export const useDashboard = create((set) => ({
    counts: { noOfFoodItems: 0, noOfCustomers: 0, noOfActiveCustomers: 0, revenue: 0 },
    monthData: {},
    percentData: [],
    setCounts: (state) => set({ counts: state }),
    setMonthData: (state) => set({ monthData: state }),
    setPercentData: (state) => set({ percentData: state }),
}))

export const useTodayOrder = create((set) => ({
    todayOrder: {},
    setTodayOrder: (state) => set({ todayOrder: state })
}))

export const useCustomer = create((set) => ({
    customers: [],
    setCustomers: (updater) =>
        set((state) => ({
            customers: typeof updater === 'function' ? updater(state.customers) : updater
        }))
}))