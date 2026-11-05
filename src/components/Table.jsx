function Table({ head, children, className = '' }) {
  return (
    <div
      className={`min-w-0 overflow-x-auto rounded-2xl border border-line bg-card ${className}`}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className="px-4 py-3 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}

export default Table
