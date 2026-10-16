export default function FilterBar({ placeholder, search, onSearch, status, onStatus }) {
  return (
    <div className="fl">
      <input className="srch" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
      <select value={status} onChange={(e) => onStatus(e.target.value)}>
        <option>All statuses</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>
  )
}