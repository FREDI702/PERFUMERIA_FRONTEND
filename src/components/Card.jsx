function Card({ className = '', children }) {
  return (
    <div className={`rounded-[28px] bg-card p-6 shadow-xl sm:p-12 ${className}`}>
      {children}
    </div>
  )
}

export default Card
