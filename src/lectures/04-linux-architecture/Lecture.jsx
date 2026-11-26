import "./lecture.css";
import DevTerminal from "./sections/DevTerminal";
import HandsOn from "./sections/HandsOn";
import Kernel from "./sections/Kernel";
import Layers from "./sections/Layers";
import { TerminalClarity } from "./sections/Shell";
import Shell from "./sections/Shell";
import Spaces from "./sections/Spaces";
import Syscalls from "./sections/Syscalls";

export default function Lecture() {
  return (
    <>
      <Layers />
      <Spaces />
      <Syscalls />
      <Kernel />
      <TerminalClarity />
      <Shell />

      <HandsOn />
      <DevTerminal />
    </>
  );
}
