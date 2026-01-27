'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Outfit } from 'next/font/google'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  X, 
  Globe, 
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  XCircle,
  User,
  FileText,
  Shield
} from 'lucide-react'

// --- FUENTE ---
const font = Outfit({ 
  subsets: ['latin'], 
  weight: ['100', '300', '400', '500', '600', '700', '800'] 
})

// --- ICONOS PERSONALIZADOS PARA REDES SOCIALES ---
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// --- TEXTOS BILINGÜES ---
const texts = {
  title: {
    es: 'Abogados Manuel Solís',
    en: 'Manuel Solís Law Firm'
  },
  subtitle: {
    es: 'ARREGLA SIN SALIR con tus Abogados de Inmigración.',
    en: 'FIX YOUR STATUS with your Immigration Lawyers.'
  },
  buttons: {
    contact: {
      es: '💙 Empieza hoy tu proceso legal 🤩',
      en: '💙 Start your legal process today 🤩'
    },
    call: {
      es: '📞 Llámanos Ahora',
      en: '📞 Call Us Now'
    },
    tiktok: {
      es: '🚀 Soluciones legales con resultados reales ⭐',
      en: '🚀 Legal solutions with real results ⭐'
    },
    instagram: {
      es: '⭐ Historias reales que inspiran cada día 💙',
      en: '⭐ Real stories that inspire every day 💙'
    },
    youtube: {
      es: '🤩 Comprometidos en brindarte apoyo legal 💪',
      en: '🤩 Committed to providing legal support 💪'
    },
    facebook: {
      es: '🙏 Juntos seguimos cambiando vidas ⭐',
      en: '🙏 Together we keep changing lives ⭐'
    },
    whatsapp: {
      es: '💬 Escríbenos por WhatsApp',
      en: '💬 Message us on WhatsApp'
    }
  },
  footer: {
    privacy: { es: 'Privacidad', en: 'Privacy' },
    terms: { es: 'Términos SMS', en: 'SMS Terms' },
    copyright: { es: '© 2025 Manuel Solis Law Firm. Todos los derechos reservados.', en: '© 2025 Manuel Solis Law Firm. All rights reserved.' }
  },
  form: {
    title: { es: 'Solicite su', en: 'Request Your' },
    titleHighlight: { es: 'Consulta', en: 'Consultation' },
    subtitle: { es: 'Manténgase informado sobre actualizaciones e información importantes.', en: 'Stay informed about important updates and information.' },
    identity: { es: 'Identidad', en: 'Identity' },
    contact: { es: 'Contacto', en: 'Contact' },
    details: { es: 'Detalles', en: 'Details' },
    firstName: { es: 'Nombre', en: 'First Name' },
    lastName: { es: 'Apellido', en: 'Last Name' },
    phone: { es: 'Teléfono', en: 'Phone Number' },
    email: { es: 'Correo', en: 'Email Address' },
    message: { es: 'Describa brevemente su situación legal...', en: 'Briefly describe your legal situation...' },
    termsAccept: { 
      es: 'Acepto los',
      en: 'I accept the'
    },
    termsOf: { es: 'Términos de Servicio', en: 'Terms of Service' },
    andRead: { es: 'y he leído la', en: 'and have read the' },
    privacyPolicy: { es: 'Política de Privacidad', en: 'Privacy Statement' },
    marketingConsent: {
      es: 'Me gustaría recibir actualizaciones del Law Office of Manuel Solís al número de teléfono proporcionado. Pueden aplicar tarifas de mensajes y datos. Responda STOP para cancelar, HELP para ayuda.',
      en: 'I would like to receive updates from the Law Office of Manuel Solís at the phone number provided. Message and data rates may apply. Reply STOP to cancel, HELP for help.'
    },
    smsTerms: { es: 'Términos de Servicio SMS', en: 'SMS Terms of Service' },
    submit: { es: 'Registrarse', en: 'Register' },
    processing: { es: 'Procesando...', en: 'Processing...' },
    successTitle: { es: '¡Enviado con Éxito!', en: 'Successfully Sent!' },
    successMessage: { es: 'Nuestro equipo revisará su caso de inmediato.', en: 'Our team will review your case immediately.' },
    errorTitle: { es: 'Error de Envío', en: 'Submission Error' },
    errorMessage: { es: 'Hubo un problema. Intente de nuevo más tarde.', en: 'There was an issue. Please try again later.' }
  },
  languageToggle: {
    es: 'EN',
    en: 'ES'
  }
}

// --- API URL ---
const API_URL = '/api/zapier-contact'

// --- ANIMACIONES ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.2
    } 
  }
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12
    } 
  }
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  }
}

// --- COMPONENTE INPUT ---
const NeonInput = (props: any) => {
  const { icon: Icon, name, type = "text", placeholder, value, onChange, required = false, isTextArea = false } = props
  const [isFocused, setIsFocused] = useState(false)

  const baseClasses = `w-full bg-[#000510]/60 border rounded-xl py-4 pl-12 pr-4 text-white font-medium placeholder-slate-500 focus:outline-none transition-colors z-10 relative
    ${isFocused ? 'border-[#B2904D]/50 bg-[#000510]/90' : 'border-white/10 hover:border-white/20'}`

  return (
    <div className="relative group">
      <div className="absolute left-4 top-4 z-20 pointer-events-none text-[#64748b] group-focus-within:text-[#B2904D] transition-colors">
        <Icon size={20} />
      </div>

      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          rows={4}
          className={`${baseClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name} 
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={baseClasses}
          placeholder={placeholder}
        />
      )}
      
      <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-transparent overflow-hidden pointer-events-none">
         <motion.div 
           initial={{ x: "-100%" }}
           animate={{ x: isFocused ? "0%" : "-100%" }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="w-full h-full bg-[#B2904D]"
         />
      </div>
    </div>
  )
}

// --- COMPONENTE BOTÓN LINKTREE ---
interface LinkButtonProps {
  icon: React.ReactNode
  text: string
  href?: string
  onClick?: () => void
  gradient?: string
  iconBg?: string
}

const LinkButton = ({ icon, text, href, onClick, gradient = 'from-[#B2904D] to-[#8B6914]', iconBg }: LinkButtonProps) => {
  const ButtonContent = () => (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full flex items-center gap-4 p-4 rounded-2xl
        bg-gradient-to-r ${gradient}
        shadow-lg shadow-black/20
        border border-white/10
        cursor-pointer overflow-hidden group
        transition-shadow duration-300
        hover:shadow-xl hover:shadow-[#B2904D]/20
      `}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
      
      <div className={`
        relative z-10 flex items-center justify-center w-12 h-12 rounded-xl
        ${iconBg || 'bg-white'} 
        shadow-md
      `}>
        {icon}
      </div>
      
      <span className="relative z-10 flex-1 text-center text-[#001540] font-semibold text-base pr-8">
        {text}
      </span>
      
      <ChevronRight className="absolute right-4 text-[#001540]/50 group-hover:text-[#001540] transition-colors" size={20} />
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        <ButtonContent />
      </a>
    )
  }

  return (
    <button onClick={onClick} className="block w-full">
      <ButtonContent />
    </button>
  )
}

// --- TRACKING ---
const trackConversionEvents = () => {
  if (typeof window !== 'undefined') {
    try {
      if ((window as any).fbq) (window as any).fbq('track', 'Lead')
      if ((window as any).ttq) (window as any).ttq.track('CompleteRegistration')
      if ((window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          'event_category': 'Contact',
          'event_label': 'Form_Submission'
        })
      }
    } catch (e) { console.error("Tracking Error", e) }
  }
}

// --- COMPONENTE PRINCIPAL ---
export default function LinktreePageContent() {
  const { language } = useLanguage()
  const lang = language as 'es' | 'en'
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    phone: '', 
    email: '', 
    enquiry_detail: '', 
    acceptedTerms: false, 
    marketingConsent: false 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = texts
    for (const k of keys) {
      value = value?.[k]
    }
    return value?.[lang] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptedTerms || isSubmitting) return
    
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = {
        ...formData, 
        utm_source: 'LINKTREE',
        utm_medium: 'Social',
        utm_campaign: 'Linktree',
        uri: typeof window !== 'undefined' ? window.location.href : '',
        language: lang
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        trackConversionEvents()
        setSubmitStatus('success')
        setFormData({ 
          first_name: '', last_name: '', phone: '', email: '', enquiry_detail: '', 
          acceptedTerms: false, marketingConsent: false 
        })
        setTimeout(() => {
          setIsContactModalOpen(false)
          setSubmitStatus('idle')
        }, 2500)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      if (submitStatus === 'error') {
        setTimeout(() => setSubmitStatus('idle'), 4000)
      }
    }
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleLanguage = () => {
    const newLang = lang === 'es' ? 'en' : 'es'
    if (typeof window !== 'undefined') {
      window.location.href = `/${newLang}/links`
    }
  }

  const socialLinks = {
    tiktok: 'https://www.tiktok.com/@abogadomanuelsolisoficial',
    instagram: 'https://www.instagram.com/abogadomanuelsolisoficial/',
    youtube: 'https://www.youtube.com/channel/UCWD61mNBq6qJ0BMhj_-a4Vg',
    facebook: 'https://www.facebook.com/AbogadoManuelSolisOficial/',
    linkedin: 'https://www.linkedin.com/company/manuel-solis-law-firm/',
    whatsapp: 'https://wa.me/17138442700'
  }

  useEffect(() => {
    if (isContactModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isContactModalOpen])

  return (
    <main className={`relative min-h-screen w-full bg-[#001540] overflow-x-hidden ${font.className}`}>
      
      {/* ===== FONDO ANIMADO ===== */}
      <div className="fixed inset-0 z-0 w-full h-full bg-[#001540]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#002868] via-[#001540] to-[#000a20]" />
        
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url(/noise.png)', backgroundRepeat: 'repeat' }} />

        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2], 
            scale: [1, 1.15, 1], 
            x: [0, 30, 0], 
            y: [0, -20, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.3, 0.15], 
            scale: [1, 1.2, 1], 
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] bg-[#B2904D]/5 rounded-full blur-[120px]" 
        />
      </div>

      {/* ===== BOTÓN DE IDIOMA ===== */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={toggleLanguage}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-medium hover:bg-white/20 transition-all shadow-lg"
      >
        <Globe size={18} />
        <span>{texts.languageToggle[lang]}</span>
      </motion.button>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-[#B2904D]/20 blur-[40px] rounded-full" />
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur-md border-2 border-[#B2904D]/50 p-3 shadow-2xl">
            <Image
              src="/LogoInformacion.png"
              alt="Manuel Solis Law Firm"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#B2904D] text-center mb-3 tracking-tight"
        >
          {texts.title[lang]}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base md:text-lg text-white/80 text-center mb-10 max-w-md font-light"
        >
          {texts.subtitle[lang]}
        </motion.p>

        {/* Botones */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-4"
        >
          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<MessageSquare className="w-6 h-6 text-[#001540]" />}
              text={texts.buttons.contact[lang]}
              onClick={() => setIsContactModalOpen(true)}
              gradient="from-[#B2904D] to-[#D4AF37]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<Phone className="w-6 h-6 text-[#001540]" />}
              text={texts.buttons.call[lang]}
              href="tel:1-888-676-1238"
              gradient="from-[#B2904D] to-[#C9A227]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<TikTokIcon className="w-6 h-6 text-black" />}
              text={texts.buttons.tiktok[lang]}
              href={socialLinks.tiktok}
              gradient="from-[#B2904D] to-[#9A7B3D]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<InstagramIcon className="w-6 h-6 text-[#E4405F]" />}
              text={texts.buttons.instagram[lang]}
              href={socialLinks.instagram}
              gradient="from-[#B2904D] to-[#A88B42]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<YouTubeIcon className="w-6 h-6 text-[#FF0000]" />}
              text={texts.buttons.youtube[lang]}
              href={socialLinks.youtube}
              gradient="from-[#B2904D] to-[#9E8245]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<FacebookIcon className="w-6 h-6 text-[#1877F2]" />}
              text={texts.buttons.facebook[lang]}
              href={socialLinks.facebook}
              gradient="from-[#B2904D] to-[#B59D4F]"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<WhatsAppIcon className="w-6 h-6 text-[#25D366]" />}
              text={texts.buttons.whatsapp[lang]}
              href={socialLinks.whatsapp}
              gradient="from-[#B2904D] to-[#A89048]"
            />
          </motion.div>
        </motion.div>

        {/* Iconos de Redes Sociales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          {[
            { href: socialLinks.instagram, icon: InstagramIcon, label: 'Instagram' },
            { href: socialLinks.facebook, icon: FacebookIcon, label: 'Facebook' },
            { href: socialLinks.whatsapp, icon: WhatsAppIcon, label: 'WhatsApp' },
            { href: socialLinks.youtube, icon: YouTubeIcon, label: 'YouTube' },
            { href: socialLinks.tiktok, icon: TikTokIcon, label: 'TikTok' },
            { href: socialLinks.linkedin, icon: LinkedInIcon, label: 'LinkedIn' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white hover:bg-[#B2904D] hover:border-[#B2904D] hover:text-[#001540] transition-all duration-300"
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-auto pt-12 pb-6 text-center"
        >
          <div className="flex items-center justify-center gap-4 text-sm text-white/40 mb-4">
            <Link href={`/${lang}/privacidad`} className="hover:text-[#B2904D] transition-colors flex items-center gap-1">
              <Shield size={14} />
              {texts.footer.privacy[lang]}
            </Link>
            <span>•</span>
            <Link href={`/${lang}/sms-terminos`} className="hover:text-[#B2904D] transition-colors flex items-center gap-1">
              <FileText size={14} />
              {texts.footer.terms[lang]}
            </Link>
          </div>
          <p className="text-xs text-white/30">
            {texts.footer.copyright[lang]}
          </p>
        </motion.footer>
      </div>

      {/* ===== MODAL DE CONTACTO ===== */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#001026]/98 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-6 md:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-thin text-white mb-4 tracking-tight">
                    {t('form.title')}{' '}
                    <span className="font-medium text-[#B2904D]">
                      {t('form.titleHighlight')}
                    </span>
                  </h2>
                  <p className="text-blue-100/70 font-light">
                    {t('form.subtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <AnimatePresence>
                    {submitStatus !== 'idle' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 z-50 bg-[#001540]/98 flex flex-col items-center justify-center text-center rounded-2xl"
                      >
                        {submitStatus === 'success' ? (
                          <>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                              <CheckCircle2 size={70} className="text-green-400 mb-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t('form.successTitle')}</h3>
                            <p className="text-blue-200">{t('form.successMessage')}</p>
                          </>
                        ) : (
                          <>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                              <XCircle size={70} className="text-red-400 mb-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t('form.errorTitle')}</h3>
                            <p className="text-red-200">{t('form.errorMessage')}</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-cyan-100/70 uppercase tracking-widest mb-3 ml-1">
                        {t('form.identity')}
                      </label>
                      <div className="space-y-4">
                        <NeonInput 
                          icon={User} 
                          name="first_name" 
                          placeholder={t('form.firstName')} 
                          value={formData.first_name} 
                          onChange={handleChange} 
                          required 
                        />
                        <NeonInput 
                          icon={User} 
                          name="last_name" 
                          placeholder={t('form.lastName')} 
                          value={formData.last_name} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cyan-100/70 uppercase tracking-widest mb-3 ml-1">
                        {t('form.contact')}
                      </label>
                      <div className="space-y-4">
                        <NeonInput 
                          icon={Phone} 
                          name="phone" 
                          type="tel" 
                          placeholder={t('form.phone')} 
                          value={formData.phone} 
                          onChange={handleChange} 
                          required 
                        />
                        <NeonInput 
                          icon={Mail} 
                          name="email" 
                          type="email" 
                          placeholder={t('form.email')} 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-100/70 uppercase tracking-widest mb-3 ml-1">
                      {t('form.details')}
                    </label>
                    <NeonInput 
                      icon={MessageSquare} 
                      name="enquiry_detail" 
                      isTextArea 
                      placeholder={t('form.message')} 
                      value={formData.enquiry_detail} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#000814]/50 border border-white/10 hover:border-white/20 transition-colors group">
                      <div className="relative flex items-center pt-1">
                        <input 
                          type="checkbox" 
                          id="acceptedTerms" 
                          name="acceptedTerms" 
                          checked={formData.acceptedTerms} 
                          onChange={handleChange} 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-transparent transition-all checked:border-[#B2904D] checked:bg-[#B2904D] hover:border-slate-400" 
                        />
                        <div className="pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 text-[#001540] opacity-0 transition-opacity peer-checked:opacity-100">
                          <CheckCircle2 size={14} strokeWidth={3} />
                        </div>
                      </div>
                      <label htmlFor="acceptedTerms" className="text-sm text-blue-100 leading-relaxed cursor-pointer select-none group-hover:text-white transition-colors">
                        {t('form.termsAccept')}{' '}
                        <Link href={`/${lang}/sms-terminos`} target="_blank" className="text-[#B2904D] hover:text-white transition-colors font-bold underline decoration-dotted">
                          {t('form.termsOf')}
                        </Link>{' '}
                        {t('form.andRead')}{' '}
                        <Link href={`/${lang}/privacidad`} target="_blank" className="text-[#B2904D] hover:text-white transition-colors font-bold underline decoration-dotted">
                          {t('form.privacyPolicy')}
                        </Link>.
                      </label>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-xl bg-[#000814]/30 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="relative flex items-center pt-1">
                        <input 
                          type="checkbox" 
                          id="marketingConsent" 
                          name="marketingConsent" 
                          checked={formData.marketingConsent} 
                          onChange={handleChange} 
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-600 bg-transparent transition-all checked:border-[#B2904D] checked:bg-[#B2904D] hover:border-slate-500" 
                        />
                        <div className="pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 text-[#001540] opacity-0 transition-opacity peer-checked:opacity-100">
                          <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                      </div>
                      <label htmlFor="marketingConsent" className="text-xs text-blue-200/80 leading-relaxed cursor-pointer select-none group-hover:text-blue-100 transition-colors">
                        {t('form.marketingConsent')}{' '}
                        <Link href={`/${lang}/sms-terminos`} target="_blank" className="text-[#B2904D] hover:text-white transition-colors font-bold underline decoration-dotted">
                          {t('form.smsTerms')}
                        </Link>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.acceptedTerms}
                      className={`
                        group relative w-full h-14 overflow-hidden rounded-xl font-bold tracking-widest uppercase text-sm transition-all shadow-lg
                        ${!formData.acceptedTerms 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                          : 'bg-[#B2904D] text-[#001026] hover:bg-[#cbb06d] cursor-pointer transform hover:-translate-y-1'
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Zap className="animate-spin text-[#001026]" size={18} /> 
                            {t('form.processing')}
                          </span>
                        ) : (
                          <>
                            <ShieldCheck size={20} className={!formData.acceptedTerms ? "text-slate-500" : "text-[#001026]"} />
                            {t('form.submit')}
                          </>
                        )}
                      </span>
                      {!isSubmitting && formData.acceptedTerms && (
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}