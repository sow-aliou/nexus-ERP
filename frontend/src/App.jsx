import React, { useState } from 'react'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/landing/Hero'
import { Features } from './components/landing/Features'
import { ModulesGrid } from './components/landing/ModulesGrid'
import { PricingSection } from './components/landing/PricingSection'
import { Footer } from './components/landing/Footer'
import { DemoModal } from './components/DemoModal'
import { RegisterModal } from './components/auth/RegisterModal'
import { OtpModal } from './components/auth/OtpModal'
import { LoginModal } from './components/auth/LoginModal'
import { WorkspaceDashboard } from './components/dashboard/WorkspaceDashboard'
import { AlertCircle, LogOut, Download, ShieldCheck, UserCheck } from 'lucide-react'
import './App.css'

function MainContent() {
  const { t } = useLanguage()
  const [demoOpen, setDemoOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const [registeredEmail, setRegisteredEmail] = useState('')
  const [debugOtpCode, setDebugOtpCode] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  const handleOtpRequested = (email, otpCode) => {
    setRegisteredEmail(email)
    setDebugOtpCode(otpCode)
    setOtpOpen(true)
  }

  const handleOtpVerified = (email) => {
    setLoginOpen(true)
  }

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (currentUser) {
    return (
      <WorkspaceDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="app-shell">
      <Navbar
        onOpenDemo={() => setDemoOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      <main>
        <Hero
          onOpenTrial={() => setRegisterOpen(true)}
          onOpenDemo={() => setDemoOpen(true)}
        />

        <Features />

        <ModulesGrid
          onOpenDemo={() => setDemoOpen(true)}
        />

        <PricingSection
          onOpenTrial={() => setRegisterOpen(true)}
        />
      </main>

      <Footer />

      {/* Modals */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOtpRequested={handleOtpRequested}
      />

      <OtpModal
        isOpen={otpOpen}
        email={registeredEmail}
        debugOtp={debugOtpCode}
        onClose={() => setOtpOpen(false)}
        onVerified={handleOtpVerified}
      />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}
