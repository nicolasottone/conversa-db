'use client'

import { FC, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { FaFile, FaTrashCan, FaCloudArrowUp } from 'react-icons/fa6'
import { useDataStore } from '@/store/dataStore'
import { usePopUpStore } from '@/store/statesStore'

interface FileFormProps {}

//TO FIX: Error in File state's caching when click in remove and choose again the same file

const FileForm: FC<FileFormProps> = () => {
  const form = useForm()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const { setData } = useDataStore()
  const { setFileFormPopUp } = usePopUpStore()

  const onSubmit = async () => {
    if (!file) return

    const fileForm = new FormData()
    fileForm.set('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: fileForm,
    })

    setData(await res.json(), fileName)
    setFileName('')
    setFile(null)
    setFileFormPopUp(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 w-full max-w-md items-center self-center text-center'
      >
        <FormField
          control={form.control}
          name='file-upload'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload your file</FormLabel>
              <FormDescription>File should be .csv .json</FormDescription>
              <FormControl>
                <div
                  className='flex flex-col items-center justify-center border-dashed border-2 h-32 text-sm hover:cursor-pointer'
                  onClick={() => inputRef.current?.click()}
                >
                  <Input
                    type='file'
                    className='hidden'
                    {...field}
                    ref={inputRef}
                    onChange={(e) => {
                      const data = e.target.files?.[0]
                      if (data) {
                        setFileName(data.name)
                        setFile(data)
                      }
                    }}
                  />
                  <FaCloudArrowUp className='text-5xl text-green-500' />
                  <span>Click here to select file</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex text-left text-sm self-start w-full justify-between'>
          {fileName ? (
            <>
              <span>
                <FaFile className='text-blue-600 inline' /> {fileName}
              </span>
              <FaTrashCan
                className='hover:cursor-pointer'
                onClick={() => {
                  setFileName('')
                  setFile(null)
                }}
              />
            </>
          ) : (
            ''
          )}
        </div>
        <Button type='submit'>Upload</Button>
      </form>
    </Form>
  )
}

export default FileForm
