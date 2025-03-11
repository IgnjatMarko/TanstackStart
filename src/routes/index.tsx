import { createFileRoute } from '@tanstack/react-router'
import MinimalShop from '@/components/shop/minimal-shop'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <MinimalShop />
    </>
  )
}
