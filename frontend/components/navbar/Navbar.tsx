"use client"

import { useSpring, animated, config } from 'react-spring'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  
  useEffect(() => {
    const updateUser = () => {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        setUser(userData)
      } else {
        setUser(null)
      }
    }
    
    // Initial load
    updateUser()
    
    // Listen for storage changes
    window.addEventListener('storage', updateUser)
    
    // Custom event for same-tab updates
    window.addEventListener('userChanged', updateUser)
    
    return () => {
      window.removeEventListener('storage', updateUser)
      window.removeEventListener('userChanged', updateUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    
    // Trigger user change event
    window.dispatchEvent(new Event('userChanged'))
    
    router.push("/auth/login")
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">Home</Button>
            </Link>
            <Link href="/about" passHref>  
              <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">About</Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">Contact</Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name || 'Guest'}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </header>
    </div>
  )
}

