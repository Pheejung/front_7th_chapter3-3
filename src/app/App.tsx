import Header from "../shared/ui/layout/Header"
import Footer from "../shared/ui/layout/Footer"
import PostsManagerPage from "../pages/PostsManagerPage.tsx"
import ToastProvider from "../shared/ui/toast"
import { QueryProvider } from "./QueryProvider"

const App = () => {
  return (
    <QueryProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManagerPage />
        </main>
        <Footer />
        <ToastProvider />
      </div>
    </QueryProvider>
  )
}

export default App
