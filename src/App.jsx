import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import WarmUp from './components/WarmUp'
import CountRace from './components/CountRace'
import Definition from './components/Definition'
import Ipos from './components/Ipos'
import Memory from './components/Memory'
import HardwareSoftware from './components/HardwareSoftware'
import Types from './components/Types'
import Servers from './components/Servers'
import WrapUp from './components/WrapUp'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#warmup">Skip to the lecture</a>
      <Nav />
      <main>
        <Hero />
        <WarmUp />
        <CountRace />
        <Definition />
        <Ipos />
        <Memory />
        <HardwareSoftware />
        <Types />
        <Servers />
        <WrapUp />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <p className="eyebrow">Up next · Lecture 2</p>
            <h2>Computer Internals</h2>
            <p>We open the box: the CPU, RAM and storage, and how they work together to run your code.</p>
          </div>
          <div className="footer-brand">
            <img src="/upgrad-sot-logo.png" alt="upGrad School of Technology" />
            <p>Catalyst · Web Essentials</p>
          </div>
        </div>
      </footer>
    </MotionConfig>
  )
}
