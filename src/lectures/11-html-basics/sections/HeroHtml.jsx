import { motion } from 'framer-motion'

export default function HeroHtml() {
  return (
    <div className="l11-hero-vis">
      <motion.div
        className="l11-hero-tag"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="l11-tag-angle">&lt;</span>
        <span className="l11-tag-name">html</span>
        <span className="l11-tag-angle">&gt;</span>
      </motion.div>
      <div className="l11-hero-nodes">
        <motion.div
          className="l11-node l11-node-head"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          &lt;head&gt;
        </motion.div>
        <motion.div
          className="l11-node l11-node-body"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          &lt;body&gt;
        </motion.div>
      </div>
    </div>
  )
}
