import './lecture.css'
import Accounts from './sections/Accounts'
import Chmod from './sections/Chmod'
import DevLife from './sections/DevLife'
import Intro from './sections/Intro'
import Ownership from './sections/Ownership'
import Practice from './sections/Practice'
import Reading from './sections/Reading'
import Rwx from './sections/Rwx'
import Umask from './sections/Umask'
import Users from './sections/Users'

export default function Lecture() {
  return (
    <>
      <Intro />
      <Rwx />
      <Reading />
      <Chmod />
      <Users />
      <Accounts />
      <Ownership />
      <Umask />
      <Practice />
      <DevLife />
    </>
  )
}
