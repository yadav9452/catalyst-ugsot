import './lecture.css'
import Cycle from './sections/Cycle'
import Hardware from './sections/Hardware'
import InputOutput from './sections/InputOutput'
import Memory from './sections/Memory'
import Performance from './sections/Performance'
import Software from './sections/Software'

export default function Lecture() {
  return (
    <>
      <Hardware />
      <Cycle />
      <Memory />
      <InputOutput />
      <Performance />
      <Software />
    </>
  )
}
