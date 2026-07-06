import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Layout/Header'
import OfflineBanner from '../components/Layout/OfflineBanner'
import ChatWindow from '../components/Chat/ChatWindow'
import InputBar from '../components/Chat/InputBar'
import QuestionPanel from '../components/Chat/QuestionPanel'
import ConsentScreen from '../components/Onboarding/ConsentScreen'
import { useChat } from '../hooks/useChat'
import api from '../api'

/**
 * Home: the consent gate, then the chat experience.
 * - If consent not yet given (sessionStorage), shows ConsentScreen.
 * - Otherwise: Header + ChatWindow + InputBar, with the OfflineBanner shown
 *   conditionally when the backend is unreachable.
 */
export default function Home() {
  const [consentGiven, setConsentGiven] = useState(
    () => sessionStorage.getItem('consent_given') === 'true',
  )
  const [offline, setOffline] = useState(false)

  const handleOffline = useCallback(() => setOffline(true), [])
  const { messages, isLoading, sendMessage } = useChat({ onOffline: handleOffline })

  // Poll the backend health endpoint once consent is given so the banner can
  // clear itself when the service recovers.
  useEffect(() => {
    if (!consentGiven) return
    let active = true
    const check = async () => {
      try {
        const res = await api.checkHealth()
        if (active) setOffline(res?.status !== 'ok')
      } catch (err) {
        if (active && err?.offline) setOffline(true)
      }
    }
    check()
    const id = setInterval(check, 30000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [consentGiven])

  if (!consentGiven) {
    return <ConsentScreen onConsent={() => setConsentGiven(true)} />
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {offline && <OfflineBanner />}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSend={sendMessage} disabled={isLoading} />
      <QuestionPanel onSelectQuestion={(q) => sendMessage(q)} />
    </div>
  )
}
