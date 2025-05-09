import React from 'react'

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0">
      <div className={`${styles.contaier} py-2 px-4 sticky top-0`}>
        <img src="/logo.png" alt="Company Logo" className={`${styles.logoLogin} h-16`} />
      </div>
    </header>
  )
}

export default Header