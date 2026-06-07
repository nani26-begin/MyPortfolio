'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn, FaInstagram, FaPython } from 'react-icons/fa'
import { FiArrowUpRight, FiCode, FiCpu, FiBarChart2 } from 'react-icons/fi'
import { SiFlutter, SiDart, SiTensorflow, SiFirebase, SiMysql, SiGit } from 'react-icons/si'
import { gsap } from '@/lib/gsap'

import profile from '@/data/profile.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, Instagram: FaInstagram }
const SIDEBAR_LABELS  = ['Instagram', 'GitHub', 'LinkedIn']

const SERVICES = [
  {
    title: "Flutter Development",
    desc: "Building cross-platform mobile apps with clean UI & smooth performance.",
    icon: FiCode
  },
  {
    title: "AI & Machine Learning",
    desc: "Exploring intelligent models and real-world AI applications.",
    icon: FiCpu
  },
  {
    title: "Data Science",
    desc: "Turning data into insights and actionable business value.",
    icon: FiBarChart2
  }
]

const TECH_ITEMS = [
  { name: "Flutter", icon: SiFlutter },
  { name: "Dart", icon: SiDart },
  { name: "Python", icon: FaPython },
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "Firebase", icon: SiFirebase },
  { name: "MySQL", icon: SiMysql },
  { name: "Git", icon: SiGit }
]

export default function HeroSection() {
  const sectionRef   = useRef(null)
  const leftColRef   = useRef(null)
  const centerColRef = useRef(null)
  const photoRef     = useRef(null)
  const techBarRef   = useRef(null)
  const socialRef    = useRef(null)

  function handleViewProjects() {
    const scroller = document.querySelector('main')
    if (scroller) {
      gsap.to(scroller, { scrollTop: 3 * window.innerHeight, duration: 1.0, ease: 'power3.inOut' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Elements to animate
    const leftItems = leftColRef.current?.children ? Array.from(leftColRef.current.children) : []
    const serviceCards = centerColRef.current?.children ? Array.from(centerColRef.current.children) : []
    const techItems = techBarRef.current ? [techBarRef.current] : []

    gsap.set(leftItems, { opacity: 0, y: 30 })
    gsap.set(serviceCards, { opacity: 0, x: 50 })
    if (photoRef.current) gsap.set(photoRef.current, { opacity: 0, scale: 0.95 })
    if (socialRef.current) gsap.set(socialRef.current, { opacity: 0, x: -20 })
    if (techBarRef.current) gsap.set(techBarRef.current, { opacity: 0, y: 20 })

    const tl = gsap.timeline({ paused: true })
    tl.to(socialRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
      .to(leftItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.3')
      .to(photoRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to(serviceCards, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.5')
      .to(techItems, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { tl.play(); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(section)
    return () => { observer.disconnect(); tl.kill() }
  }, [])

  const sidebarSocials = SIDEBAR_LABELS
    .map(label => profile.socials.find(s => s.label === label))
    .filter(Boolean)

  return (
    <section ref={sectionRef} className={styles.section}>
      <HeroBackground />
      
      {/* Decorative Glows */}
      <div className={styles.glow} />
      <div className={styles.photoGlow} />

      {/* Social Sidebar */}
      <div ref={socialRef} className={styles.socialSidebar}>
        {sidebarSocials.map(social => {
          const Icon = SOCIAL_ICON_MAP[social.label]
          if (!Icon) return null
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
            >
              <Icon size={15} />
              <span className={styles.socialLabel}>{social.label}</span>
            </a>
          )
        })}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll down</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="6" r="2" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.container}>
        
        {/* Left Column: Greeting, Name, Description, CTA, Stats */}
        <div ref={leftColRef} className={styles.leftCol}>
          <div className={styles.greeting}>
            <span className={styles.greetText}>Hi, I'm</span>
            <span className={styles.roleText}>{profile.roles.short}</span>
          </div>

          <h1 className={styles.name}>{profile.name.first}</h1>

          <p className={styles.tagline}>{profile.tagline}</p>

          <button type="button" className={styles.viewBtn} onClick={handleViewProjects}>
            View My Work <FiArrowUpRight />
          </button>

          <div className={styles.stats}>
            {profile.stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Services Stack */}
        <div ref={centerColRef} className={styles.centerCol}>
          {SERVICES.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.serviceIconContainer}>
                  <Icon className={styles.serviceIcon} />
                </div>
                <div className={styles.serviceText}>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Profile Image */}
        <div ref={photoRef} className={styles.photoContainer}>
          <div className={styles.photoWrapper}>
            <Image
              src="/assets/ajit-hero.png"
              alt={profile.name.full}
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className={styles.photoImg}
            />
          </div>
        </div>

      </div>

      {/* Bottom Row: Tech Stack Bar */}
      <div ref={techBarRef} className={styles.techStackBar}>
        <span className={styles.techStackLabel}>Tech Stack &gt;</span>
        <div className={styles.techIcons}>
          {TECH_ITEMS.map((t, idx) => {
            const Icon = t.icon
            return (
              <div key={idx} className={styles.techItem}>
                <Icon className={styles.techIcon} />
                <span>{t.name}</span>
              </div>
            )
          })}
        </div>
      </div>

    </section>
  )
}
