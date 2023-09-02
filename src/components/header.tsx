import { FC } from 'react'

interface headerProps {}

const Header: FC<headerProps> = ({}) => {
  return (
    <section className='grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='flex flex-col items-start gap-2'>
        <h1 className='text-3xl antialiased font-extrabold leading-tight tracking-tighter md:text-4xl'>
          AI-Powered Search Engine 🚀
        </h1>
        <h2 className='text-lg antialiased text-muted-foreground'>
          Make your searches friendly
        </h2>
      </div>
    </section>
  )
}

export default Header
