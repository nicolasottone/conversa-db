'use client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  filterFns,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Key, MoveDown, MoveUp } from 'lucide-react'
import { useState } from 'react'
import { DataTablePagination } from './pagination'
import Hamburger from '@/components/table/hamburger'
import FileForm from '@/components/file-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  //columns: ColumnDef<TData, TValue>[]
  data: TData[]
  tableName: string
}

export function DataTable<TData>({ data, tableName }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  //Columns parse
  const DataFields = data.length ? Object.keys(data[0]!) : []

  type ColumnsType = { accesorKey: string; header: string }
  const sampleData = data.length ? data[0] : undefined
  const columns: ColumnDef<typeof sampleData, ColumnsType>[] = (
    data.length ? Object.keys(data[0]!) : []
  ).map((key) => {
    const capitalizedKey = key
      .replace(/_/g, ' ')
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      )
    return {
      accessorKey: key,
      filterFn: filterFns.weakEquals,

      //Sorting headers
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            className={cn('justify-between p-0 w-full')}
            onClick={() => {
              column.toggleSorting()
            }}
          >
            {capitalizedKey}
            {column.getIsSorted() ? (
              column.getIsSorted() === 'asc' ? (
                <MoveDown className='h-4 w-4' />
              ) : (
                <MoveUp className='h-4 w-4' />
              )
            ) : (
              ''
            )}
          </Button>
        )
      },
    }
  })
  //
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: true,
    enableMultiSort: true,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className='rounded-md border'>
        <div className='flex justify-between'>
          <h2 className='antialiased font-extrabold tracking-tighter text-xl p-4'>
            {tableName}
          </h2>
          <Hamburger />
        </div>
        {/* Input Filter */}
        {data.length ? (
          <div className='flex items-center py-4'>
            <Input
              placeholder='Filter ids...'
              value={
                (table.getColumn('email')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) => {
                table.getColumn('email')?.setFilterValue(event.target.value)
              }}
              className='max-w-sm ml-3'
            />
          </div>
        ) : (
          ''
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {data.length ? (
                    'No results'
                  ) : (
                    <div className='flex flex-col p-5 gap-5'>
                      <FileForm />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls*/}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
