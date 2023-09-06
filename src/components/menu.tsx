import { FC } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import FileForm from './file-form'
import { cn } from '@/lib/utils'
import { BsChatDots } from 'react-icons/bs'
import Chat from './chat'
import { Button } from './ui/button'

interface MenuProps {}

/* const fetchAPI = async () => {
  const response = await fetch('/api/search', {
    method: 'POST',
    body: 'Este es el body',
  })
}
 */
const Menu: FC<MenuProps> = () => {
  //const chatbotSetup = await setupMessage()
  return (
    <Sheet modal={false}>
      <SheetTrigger className={cn('fixed right-10 bottom-5')}>
        <BsChatDots className='text-4xl' />
      </SheetTrigger>
      <SheetContent className='min-w-[480] h-screen w-full flex flex-col'>
        <FileForm />
        <Button>Click aca para buscar</Button>
        <Chat />
      </SheetContent>
    </Sheet>
  )
}

export default Menu
