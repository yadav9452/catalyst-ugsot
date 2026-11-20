import './lecture.css'
import Beyond from './sections/Beyond'
import CountRace from './sections/CountRace'
import Definition from './sections/Definition'
import HardwareSoftware from './sections/HardwareSoftware'
import Ipos from './sections/Ipos'
import Memory from './sections/Memory'
import Servers from './sections/Servers'
import Types from './sections/Types'
import WarmUp from './sections/WarmUp'

export default function Lecture() {
  return (
    <>
      <WarmUp />
      <CountRace />
      <Definition />
      <Ipos />
      <Memory />
      <HardwareSoftware />
      <Types />
      <Servers />
      <Beyond />
    </>
  )
}
