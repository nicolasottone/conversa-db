'use client'
import { FC, useEffect, useState } from 'react'
import { useDataStore } from '@/store/dataStore'
import { DataTable } from '@/components/table/table'
import Header from '@/components/header'
import Menu from '@/components/menu'

interface homePageProps {}

//guardar localmente la data
//colocar botón de borrar data
//colocar chatbot

const HomePage: FC<homePageProps> = ({}) => {
  const { data, dataName } = useDataStore()
  const [result, setResult] = useState<any[]>([])

  return (
    <main className='container self-center'>
      <Header />
      <Menu />
      <DataTable data={data} tableName={dataName} />
    </main>
  )
}

export default HomePage
