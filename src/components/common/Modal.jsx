export default function Modal({ title, okLabel, onOk, onClose, children }) {
  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="md">
        <h2>{title}</h2>
        {children}
        <div className="ma">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn p" onClick={onOk}>{okLabel}</button>
        </div>
      </div>
    </div>
  )
}