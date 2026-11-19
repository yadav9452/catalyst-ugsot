import './lecture.css'
import Distros from './sections/Distros'
import Everywhere from './sections/Everywhere'
import GetLinux from './sections/GetLinux'
import Hook from './sections/Hook'
import Interfaces from './sections/Interfaces'
import Jobs from './sections/Jobs'
import KernelShell from './sections/KernelShell'
import OpenSource from './sections/OpenSource'
import ThreeOS from './sections/ThreeOS'
import WhyOS from './sections/WhyOS'

export default function Lecture() {
  return (
    <>
      <Hook />
      <WhyOS />
      <Jobs />
      <Interfaces />
      <KernelShell />
      <ThreeOS />
      <OpenSource />
      <Distros />
      <Everywhere />
      <GetLinux />
    </>
  )
}
