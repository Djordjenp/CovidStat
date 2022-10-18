import create from "zustand";

const useLoaderStore = create(set => ({
    pieChartLoaded: false,
    setPieChartLoaded: (x) => set(state => ({pieChartLoaded: x}))
}))

export default useLoaderStore;