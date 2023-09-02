import { create } from 'zustand'
import mock_data from '@/lib/MOCK_DATA.json'

interface DataState {
  data: any[]
  dataName: string
  setData: (newData: any[], newDataName: string) => void
}

export const useDataStore = create<DataState>((set) => ({
  data: mock_data,
  dataName: 'Mock Data',
  setData: (newData: any[], newDataName: string) =>
    set({
      data: newData,
      dataName: newDataName,
    }),
}))
