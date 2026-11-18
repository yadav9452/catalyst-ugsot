import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import LecturePage from './pages/LecturePage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lecture/:slug" element={<LecturePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
