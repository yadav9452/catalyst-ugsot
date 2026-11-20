import { Illo, Section, Step } from '../../../design-system'

export default function Servers() {
  return (
    <>
      <Section
        id="servers"
        eyebrow="The most important one for you"
        title="Servers: the computers behind every website"
        intro="A server is a computer that provides data or services to other computers, called clients. When you open a website, your browser is the client."
        steps={3}
      >
        <div className="card-grid three">
          {[
            ['Runs 24/7', 'So websites are always available', 'Clock'],
            ['Serves many clients', 'Thousands of browsers at the same time', 'Server'],
            ['Lives in data centers', 'Buildings full of servers, cooled and powered round the clock', 'DataCenter'],
          ].map(([t, d, illo], i) => (
            <Step key={t} n={i + 1} className="card fact-card" delay={i * 0.08}>
              <Illo name={illo} size={112} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
      </Section>
    </>
  )
}
