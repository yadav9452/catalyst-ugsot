import './lecture.css'
import Credits from './sections/Credits'
import CpuTeam from './sections/CpuTeam'
import Cycle from './sections/Cycle'
import Hardware from './sections/Hardware'
import InputOutput from './sections/InputOutput'
import Memory from './sections/Memory'
import Motherboard from './sections/Motherboard'
import OpenBox from './sections/OpenBox'
import Performance from './sections/Performance'
import Software from './sections/Software'

export default function Lecture() {
  return (
    <>
      <OpenBox />
      <Motherboard />
      <Hardware />
      <CpuTeam />
      <Cycle />
      <Memory />
      <InputOutput />
      <Performance />
      <Software />
      <Credits />
    </>
  )
}
