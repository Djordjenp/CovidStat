import create from "zustand";

const useScrollToCountriesStore = create(set => ({
    shouldScroll: false,
    setShouldScroll: (x) => set(state => ({shouldScroll: x}))
}))

export default useScrollToCountriesStore;