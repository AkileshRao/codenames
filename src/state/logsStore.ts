import { create } from "zustand";

export type LogsState = {
    logs: string[];
    updateLogs: (logs: string[]) => void;
}

const useLogsStore = create<LogsState>((set) => ({
    logs: [],
    updateLogs: (newLogs: string[]) => set(({ logs: newLogs }))
}))

export default useLogsStore;