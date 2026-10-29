export default function SectionHeading({ eyebrow, title, id, aside }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {aside}
    </div>
  )
}
