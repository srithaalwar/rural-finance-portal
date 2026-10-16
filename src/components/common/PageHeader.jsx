export default function PageHeader({ breadcrumb, title, subtitle, actions }) {
  return (
    <div className="ph">
      <div>
        <div className="bc">{breadcrumb}</div>
        <h1>{title}</h1>
        <div className="mu">{subtitle}</div>
      </div>
      <div className="ph-actions">{actions}</div>
    </div>
  )
}