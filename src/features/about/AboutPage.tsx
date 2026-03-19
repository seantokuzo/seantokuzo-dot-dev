import { bio, socialLinks } from '../../data/bio'
import { skills, skillCategories, type SkillCategory } from '../../data/skills'
import { experience } from '../../data/experience'
import styles from './AboutPage.module.css'

function BioSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTagline}>{bio.tagline}</h1>
      <p className={styles.heroSubtitle}>{bio.title}</p>
      <div className={styles.bioParagraphs}>
        {bio.summary.map((paragraph, i) => (
          <p key={i} className={styles.bioParagraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

function SkillsSection() {
  const grouped = Object.entries(skillCategories).map(([key, label]) => ({
    key: key as SkillCategory,
    label,
    items: skills.filter((s) => s.category === key),
  }))

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Skills & Technologies</h2>
      <div className={styles.skillsGrid}>
        {grouped.map(({ key, label, items }) => (
          <div key={key} className={styles.skillCategory}>
            <h3 className={styles.skillCategoryTitle}>{label}</h3>
            <div className={styles.skillList}>
              {items.map((skill) => (
                <span key={skill.name} className={styles.skillTag}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ResumeSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Experience</h2>
      <div className={styles.timeline}>
        {experience.map((exp, i) => (
          <div key={i} className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>{exp.period}</div>
            <h3 className={styles.timelineTitle}>{exp.title}</h3>
            <div className={styles.timelineCompany}>{exp.company}</div>
            <p className={styles.timelineDescription}>{exp.description}</p>
            <div className={styles.timelineHighlights}>
              {exp.highlights.map((h, j) => (
                <span key={j} className={styles.timelineHighlight}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Get In Touch</h2>
      <div className={styles.contactGrid}>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <div className={styles.page}>
      <BioSection />
      <SkillsSection />
      <ResumeSection />
      <ContactSection />
    </div>
  )
}
