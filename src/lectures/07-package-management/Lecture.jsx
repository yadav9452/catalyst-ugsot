import './lecture.css'
import AptDpkg from './sections/AptDpkg'
import Challenge from './sections/Challenge'
import Cleanup from './sections/Cleanup'
import Commands from './sections/Commands'
import DevLife from './sections/DevLife'
import Intro from './sections/Intro'
import Manager from './sections/Manager'
import Package from './sections/Package'
import Practice from './sections/Practice'
import Repos from './sections/Repos'
import UpdateUpgrade from './sections/UpdateUpgrade'
import WebContext from './sections/WebContext'

export default function Lecture() {
  return (
    <>
      <Intro />
      <Package />
      <Manager />
      <AptDpkg />
      <Repos />
      <Commands />
      <UpdateUpgrade />
      <Cleanup />
      <Challenge />
      <WebContext />
      <Practice />
      <DevLife />
    </>
  )
}
