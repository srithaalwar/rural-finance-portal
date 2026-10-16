export default function KpiCard({ label, value, note }) {
  return (
    <div className="cd kp">
      <div className="l">{label}</div>
      <div className="v">{value}</div>
      <div className="d">{note}</div>
    </div>
  )
}