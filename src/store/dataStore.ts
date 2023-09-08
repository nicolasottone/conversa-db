import { create } from 'zustand'
import mock_data from '@/lib/MOCK_DATA.json'
import { sql } from 'drizzle-orm'
import { db } from '@/db/config'

interface DataState {
  data: any[]
  dataName: string
  setData: (newData: any[]) => void
  setDataName: (newDataName: string) => void
  // fetchData: (state: DataState) => void
}

export const useDataStore = create<DataState>((set) => ({
  data: mock_data,
  dataName: 'mock_data',
  setData: (newData: any[]) =>
    set((state) => ({
      data: newData,
      dataName: state.dataName,
    })),
  setDataName: (newDataName: string) =>
    set((state) => ({
      data: state.data,
      dataName: newDataName,
    })),
  //   fetchData: async (state) => {
  //     const res = await db.execute(sql`SELECT * FROM ${state.dataName}`)
  //     set((state) => ({
  //       ...state,
  //       data: res.rows,
  //     }
  //     ))
  // },
}))

//DB QUERY
// const results = await db.execute(
//   sql`SELECT
//   column_name,
//   data_type,
//   is_nullable,
//   character_maximum_length,
//   numeric_precision_radix
//   FROM information_schema.columns WHERE table_name = 'mock_data';
// `
// )
