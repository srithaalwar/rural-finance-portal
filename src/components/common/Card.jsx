export default function Card({ title, action, flush, children }) {
  return (
    <div className={`cd ${flush ? 'n' : ''}`}>
      {title && (
        <div className="ct">
          <h2>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}