import { ROLE_TONE } from '../../data/mockData'

const STATUS_TONE = { Active: 'ok', Inactive: 'gy' }

export default function Badge({ children, tone }) {
  const cls = tone || STATUS_TONE[children] || ROLE_TONE[children] || 'gy'
  return <span className={`bd ${cls}`}>{children}</span>
}