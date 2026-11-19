import './lecture.css'
import Basics from './sections/Basics'
import Create from './sections/Create'
import Editors from './sections/Editors'
import FileOps from './sections/FileOps'
import Fhs from './sections/Fhs'
import Folders from './sections/Folders'
import Lab from './sections/Lab'
import Names from './sections/Names'
import Navigate from './sections/Navigate'
import Paths from './sections/Paths'
import Tree from './sections/Tree'

export default function Lecture() {
  return (
    <>
      <Basics />
      <Tree />
      <Fhs />
      <Paths />
      <Navigate />
      <Create />
      <Editors />
      <Folders />
      <FileOps />
      <Names />
      <Lab />
    </>
  )
}
