'use client';

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  X, 
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  User,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Play,
  ChevronDown
} from 'lucide-react'

// --- CONSTANTES Y CONFIGURACIÓN ---
const API_URL = '/api/zapier-contact'
const YOUTUBE_VIDEO_ID = 'AWgRoJitmJo'
const YOUTUBE_LINK = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`
const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`
const YOUTUBE_THUMBNAIL_FALLBACK = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`

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

// --- ICONOS PERSONALIZADOS (SVG) ---
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

// --- TEXTOS ---
const texts = {
  title: {
    es: 'ABOGADOS MANUEL SOLÍS',
    en: 'MANUEL SOLÍS LAW FIRM'
  },
  subtitle: {
    es: 'Arregla sin salir con tus Abogados de Inmigración.',
    en: 'Fix your status with your Immigration Lawyers.'
  },
  buttons: {
    contact: {
      es: 'EMPIEZA HOY TU PROCESO',
      en: 'START YOUR PROCESS TODAY'
    },
    call: {
      es: 'LLÁMANOS AHORA',
      en: 'CALL US NOW'
    },
    video: {
      es: 'MIRA NUESTRO VIDEO RECIENTE',
      en: 'WATCH OUR RECENT VIDEO'
    }
  },
  footer: {
    privacy: { es: 'Privacidad', en: 'Privacy' },
    terms: { es: 'Términos SMS', en: 'SMS Terms' },
    copyright: { es: '© 2025 Manuel Solis Law Firm.' }
  },
  form: {
    title: { es: 'Solicite su', en: 'Request Your' },
    titleHighlight: { es: 'Consulta', en: 'Consultation' },
    subtitle: { es: 'Manténgase informado sobre actualizaciones importantes.', en: 'Stay informed about important updates.' },
    identity: { es: 'Identidad', en: 'Identity' },
    contact: { es: 'Contacto', en: 'Contact' },
    details: { es: 'Detalles', en: 'Details' },
    firstName: { es: 'Nombre', en: 'First Name' },
    lastName: { es: 'Apellido', en: 'Last Name' },
    phone: { es: 'Teléfono', en: 'Phone Number' },
    email: { es: 'Correo', en: 'Email Address' },
    message: { es: 'Describa brevemente su situación legal...', en: 'Briefly describe your legal situation...' },
    termsAccept: { es: 'Acepto los', en: 'I accept the' },
    termsOf: { es: 'Términos de Servicio', en: 'Terms of Service' },
    andRead: { es: 'y he leído la', en: 'and have read the' },
    privacyPolicy: { es: 'Política de Privacidad', en: 'Privacy Statement' },
    marketingConsent: {
      es: 'Me gustaría recibir actualizaciones del Law Office of Manuel Solís.',
      en: 'I would like to receive updates from the Law Office of Manuel Solís.'
    },
    smsTerms: { es: 'Términos de Servicio SMS', en: 'SMS Terms of Service' },
    submit: { es: 'Enviar Solicitud', en: 'Submit Request' },
    processing: { es: 'Procesando...', en: 'Processing...' },
    successTitle: { es: '¡Enviado!', en: 'Sent!' },
    successMessage: { es: 'Revisaremos su caso de inmediato.', en: 'We will review your case immediately.' },
    errorTitle: { es: 'Error', en: 'Error' },
    errorMessage: { es: 'Hubo un problema. Intente de nuevo más tarde.', en: 'There was an issue. Please try again later.' }
  },
  languageToggle: {
    es: 'English',
    en: 'Español'
  }
}

// --- CONTEXT MOCK ---
const useLanguage = () => {
  const [lang, setLang] = useState('es');
  return { language: lang, setLanguage: setLang };
}

// --- ANIMACIONES ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 80, damping: 12 } 
  }
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
}

// --- COMPONENTES ---

const NeonInput = (props: any) => {
  const { icon: Icon, name, type = "text", placeholder, value, onChange, required = false, isTextArea = false } = props
  const [isFocused, setIsFocused] = useState(false)

  const baseClasses = `w-full bg-[#000510]/50 border rounded-xl py-4 pl-12 pr-4 text-white font-medium placeholder-slate-500 focus:outline-none transition-all duration-300 relative
    ${isFocused ? 'border-[#B2904D] bg-[#000510]/80 shadow-[0_0_15px_-3px_rgba(178,144,77,0.3)]' : 'border-white/10 hover:border-white/20'}`

  return (
    <div className="relative group">
      <div className={`absolute left-4 top-4 z-20 pointer-events-none transition-colors duration-300 ${isFocused ? 'text-[#B2904D]' : 'text-slate-500'}`}>
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
    </div>
  )
}

interface LinkButtonProps {
  icon: React.ReactNode
  text: string
  href?: string
  onClick?: () => void
  highlight?: boolean
  gradient?: string
}

const LinkButton = ({ icon, text, href, onClick, highlight = false, gradient }: LinkButtonProps) => {
  const Content = () => (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full flex items-center justify-between p-1 rounded-full
        transition-all duration-300 group overflow-hidden
        ${highlight 
          ? 'shadow-[0_4px_20px_-5px_rgba(178,144,77,0.4)]' 
          : 'bg-white/5 border border-white/10 hover:border-[#B2904D]/50 hover:shadow-[0_4px_20px_-5px_rgba(178,144,77,0.3)] backdrop-blur-md'
        }
      `}
      style={highlight ? { background: gradient || 'linear-gradient(90deg, #B2904D 0%, #F2D06B 50%, #B2904D 100%)' } : {}}
    >
      {/* Container Icono */}
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-full shrink-0 m-1
        ${highlight 
          ? 'bg-white text-[#001540]' 
          : 'bg-white/10 text-white group-hover:bg-white group-hover:text-[#001540] transition-colors duration-300'
        }
      `}>
        {icon}
      </div>
      
      {/* Texto */}
      <span className={`
        flex-1 text-center font-bold text-base px-2 uppercase tracking-wide
        ${highlight 
          ? 'text-[#001540]' 
          : 'text-white group-hover:text-[#001540] transition-colors duration-300'
        }
      `}>
        {text}
      </span>
      
      {/* Flecha */}
      <div className="w-12 flex items-center justify-center shrink-0">
         <ChevronRight className={`
           w-5 h-5 transition-transform duration-300 group-hover:translate-x-1
           ${highlight ? 'text-[#001540]/50' : 'text-white/30 group-hover:text-[#001540]/50'}
         `} />
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        <Content />
      </a>
    )
  }

  return (
    <button onClick={onClick} className="block w-full">
      <Content />
    </button>
  )
}

// --- NUEVO COMPONENTE: VIDEO ACCORDION ---
const VideoSection = ({ text }: { text: string }) => {
    const [thumbError, setThumbError] = useState(false)

    return (
        <div className="w-full">
            {/* Encabezado del video */}
            <div
                className={`
                    relative w-full flex items-center justify-between p-1 rounded-full
                    transition-all duration-300 group overflow-hidden mb-3
                    bg-white/5 border border-[#B2904D]/50 bg-[#B2904D]/10 backdrop-blur-md
                `}
            >
                {/* Icono Youtube */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 m-1 bg-white text-[#001540]">
                    <Youtube size={22} />
                </div>

                {/* Texto */}
                <span className="flex-1 text-center font-bold text-base px-2 uppercase tracking-wide text-[#B2904D]">
                    {text}
                </span>

                {/* Espacio para mantener simetría */}
                <div className="w-12 shrink-0" />
            </div>

            {/* Video siempre visible */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <motion.a
                    href={YOUTUBE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-lg hover:shadow-[#B2904D]/20 transition-all duration-300"
                >
                    {/* Background Thumbnail con fallback */}
                    <img
                        src={thumbError ? YOUTUBE_THUMBNAIL_FALLBACK : YOUTUBE_THUMBNAIL}
                        alt="Video reciente - Abogados Manuel Solís"
                        onError={() => setThumbError(true)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay Oscuro */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-full bg-[#B2904D]/90 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                        >
                            <Play className="w-7 h-7 text-[#001026] ml-1" fill="currentColor" />
                        </motion.div>
                    </div>

                    {/* Borde Brillante al Hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#B2904D]/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
                </motion.a>
            </motion.div>
        </div>
    )
}


// --- COMPONENTE PRINCIPAL ---
export default function LinktreePageContent() {
  const { language, setLanguage } = useLanguage()
  const lang = language as 'es' | 'en'
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    first_name: '', last_name: '', phone: '', email: '', enquiry_detail: '', 
    acceptedTerms: false, marketingConsent: false 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || ''
      })
    }
  }, [])

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = texts
    for (const k of keys) value = value?.[k]
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
        utm_source: utmParams.source || 'LINKTREE', 
        utm_medium: utmParams.medium || 'Social',
        utm_campaign: utmParams.campaign || 'Linktree',
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
        console.error("API Error:", response.status)
      }
    } catch (error) {
      console.error("Submission Error:", error)
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
    setLanguage(lang === 'es' ? 'en' : 'es')
  }

  const socialLinks = {
    tiktok: 'https://www.tiktok.com/@abogadomanuelsolisoficial',
    instagram: 'https://www.instagram.com/abogadomanuelsolisoficial/',
    youtube: 'https://www.youtube.com/channel/UCWD61mNBq6qJ0BMhj_-a4Vg',
    facebook: 'https://www.facebook.com/AbogadoManuelSolisOficial/',
    linkedin: 'https://www.linkedin.com/company/manuel-solis-law-firm/',
    whatsapp: 'https://wa.me/17138442700'
  }

  return (
    <main className="relative min-h-screen w-full bg-[#001026] overflow-x-hidden font-sans">
      
      {/* ===== FONDO ===== */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001540] via-[#000F2E] to-[#000510]" />
        {/* Orbes Animados */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-20%] w-[600px] h-[600px] bg-[#0047AB]/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-[#B2904D]/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* ===== TOGGLE IDIOMA ===== */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-wider"
      >
        {texts.languageToggle[lang]}
      </motion.button>

      {/* ===== CONTENIDO ===== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center max-w-lg mx-auto px-6 py-12 md:py-16">
        
        {/* Sección Perfil */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          // SEPARACION: Aumentado mb-6 a mb-12 para separar del cuerpo
          className="relative mb-12 text-center"
        >
          {/* Logo Container - AUMENTADO DE TAMAÑO */}
          <div className="relative w-56 h-56 mx-auto mb-6"> 
            <div className="absolute inset-0 bg-[#B2904D] rounded-full blur-2xl opacity-20 animate-pulse"></div>
            {/* ARO MÁS PEQUEÑO: Reducido border-2 a border y p-1 a p-0.5 */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 p-[2px] border border-[#B2904D]/20 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#001540] flex items-center justify-center relative overflow-hidden">
                <img
                  src="/LogoInformacion.png" 
                  alt="Manuel Solis"
                  // LOGO MÁS GRANDE: Aseguramos que llene todo
                  className="w-full h-full object-cover rounded-full"
                />
                 {/* Fallback visual */}
                 <div className="absolute inset-0 flex items-center justify-center bg-[#001540] -z-10">
                    <span className="text-[#B2904D] font-bold text-5xl">MS</span>
                 </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg uppercase">
            {texts.title[lang]}
          </h1>
          <p className="text-[#B2904D] font-medium text-lg tracking-wide opacity-90">
            {texts.subtitle[lang]}
          </p>
        </motion.div>

        {/* Lista de Botones */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full space-y-5"
        >
          {/* 1. Botón Contacto (Formulario) */}
          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<MessageSquare size={22} />}
              text={texts.buttons.contact[lang]}
              onClick={() => setIsContactModalOpen(true)}
              highlight={true}
            />
          </motion.div>

          {/* 2. Botón Llamar */}
          <motion.div variants={itemVariants}>
            <LinkButton
              icon={<Phone size={22} />}
              text={texts.buttons.call[lang]}
              href="tel:+18886761238"
            />
          </motion.div>

          {/* 3. VIDEO SIEMPRE VISIBLE */}
          <motion.div variants={itemVariants}>
             <VideoSection text={texts.buttons.video[lang]} />
          </motion.div>

        </motion.div>

        {/* Separador Sutil */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-10 mb-6"
        />

        {/* Footer Iconos Redes Sociales */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6"
        >
          {[
            { Icon: Instagram, href: socialLinks.instagram },
            { Icon: Facebook, href: socialLinks.facebook },
            { Icon: TikTokIcon, href: socialLinks.tiktok },
            { Icon: Youtube, href: socialLinks.youtube },
            { Icon: Linkedin, href: socialLinks.linkedin }
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full text-white/40 hover:text-[#B2904D] hover:bg-white/5 hover:scale-110 transition-all duration-300"
            >
              <item.Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Links Legales */}
        <footer className="mt-8 text-center space-y-2 pb-6">
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-white/30 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
            <p className="text-[10px] text-white/20">© 2025 Manuel Solis Law Firm</p>
        </footer>

      </div>

      {/* ===== MODAL DE CONTACTO ===== */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#001026] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="relative px-8 pt-8 pb-6 text-center bg-gradient-to-b from-[#001540] to-[#001026]">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-light text-white uppercase tracking-wider">
                  {t('form.title')} <span className="font-bold text-[#B2904D]">{t('form.titleHighlight')}</span>
                </h2>
                <div className="w-16 h-1 bg-[#B2904D] mx-auto mt-4 rounded-full" />
              </div>

              {/* Body Modal */}
              <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <NeonInput icon={User} name="first_name" placeholder={t('form.firstName')} value={formData.first_name} onChange={handleChange} required />
                    <NeonInput icon={User} name="last_name" placeholder={t('form.lastName')} value={formData.last_name} onChange={handleChange} required />
                  </div>
                  
                  <NeonInput icon={Phone} name="phone" type="tel" placeholder={t('form.phone')} value={formData.phone} onChange={handleChange} required />
                  <NeonInput icon={Mail} name="email" type="email" placeholder={t('form.email')} value={formData.email} onChange={handleChange} required />
                  
                  <NeonInput icon={MessageSquare} name="enquiry_detail" isTextArea placeholder={t('form.message')} value={formData.enquiry_detail} onChange={handleChange} required />

                  {/* Términos */}
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="relative flex items-center mt-0.5">
                        <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} className="peer sr-only" />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.acceptedTerms ? 'bg-[#B2904D] border-[#B2904D]' : 'border-slate-500'}`}>
                            {formData.acceptedTerms && <CheckCircle2 size={14} className="text-[#001026]" />}
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 leading-relaxed">
                        {t('form.termsAccept')} <span className="text-[#B2904D] underline">{t('form.termsOf')}</span> {t('form.andRead')} <span className="text-[#B2904D] underline">{t('form.privacyPolicy')}</span>.
                    </span>
                  </label>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptedTerms}
                    className={`
                      w-full h-14 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg transition-all
                      flex items-center justify-center gap-2
                      ${!formData.acceptedTerms 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#B2904D] to-[#8B6914] text-white hover:shadow-[#B2904D]/25 hover:scale-[1.02]'
                      }
                    `}
                  >
                     {isSubmitting ? (
                        <>
                            <Zap className="animate-spin" size={18} />
                            {t('form.processing')}
                        </>
                     ) : (
                        <>
                            <ShieldCheck size={18} />
                            {t('form.submit')}
                        </>
                     )}
                  </button>
                  
                  {/* Mensajes de Estado */}
                  {submitStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-green-500/20 text-green-200 text-center text-sm font-medium border border-green-500/30">
                        {t('form.successTitle')} {t('form.successMessage')}
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-red-500/20 text-red-200 text-center text-sm font-medium border border-red-500/30">
                        {t('form.errorTitle')} {t('form.errorMessage')}
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}