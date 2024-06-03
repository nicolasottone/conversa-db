import { FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HamburgerMenuIcon,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import FileForm from '../file-form'
import { useDataStore } from '@/store/dataStore'
import { useMessagesStore } from '@/store/chatStore'
import { usePopUpStore } from '@/store/statesStore'

interface hamburgerProps {}

const Hamburger: FC<hamburgerProps> = ({}) => {
  const { setData } = useDataStore()
  const { setHistory } = useMessagesStore()
  const { fileFormPopUp, setFileFormPopUp } = usePopUpStore()
  return (
    <Dialog open={fileFormPopUp} onOpenChange={setFileFormPopUp}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className={cn('p-3 rounded')}>
          <HamburgerMenuIcon className='text-xl' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger className={cn('w-full')}>
            <DropdownMenuItem>Upload file</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>Clear tags</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setHistory([])}>
            Clear chat historial
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setData([])}
          >
            Clear data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <FileForm />
      </DialogContent>
    </Dialog>
  )
}

export default Hamburger
