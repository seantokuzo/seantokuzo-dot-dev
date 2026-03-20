import { useEffect } from 'react'
import { bio, socialLinks } from '../../data/bio'
import { skills, skillCategories, type SkillCategory } from '../../data/skills'
import { experience } from '../../data/experience'
import { projects } from '../../data/projects'
import styles from './AboutPage.module.css'

function BioSection() {
  return (
    <section className={styles.hero} aria-label="About me">
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTagline}>{bio.tagline}</h1>
          <p className={styles.heroSubtitle}>{bio.title} · {bio.location}</p>
          <div className={styles.bioParagraphs}>
            {bio.summary.map((paragraph, i) => (
              <p key={i} className={styles.bioParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.avatarWrapper}>
          <div
            className={styles.avatar}
            role="img"
            aria-label={`Avatar for ${bio.name}`}
          >
            <span className={styles.avatarInitials} aria-hidden="true">
              {bio.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
        </div>
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
    <section className={styles.section} aria-label="Skills and technologies">
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

function ProjectsSection() {
  const featured = projects.filter((p) => p.featured)

  return (
    <section className={styles.section} aria-label="Featured projects">
      <h2 className={styles.sectionTitle}>Featured Projects</h2>
      <div className={styles.projectsGrid}>
        {featured.map((project) => (
          <article key={project.id} className={styles.projectCard}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectTech}>
              {project.tech.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>
            <div className={styles.projectLinks}>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                  aria-label={`View ${project.title} live`}
                >
                  Live
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                  aria-label={`Source code for ${project.title}`}
                >
                  Source
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className={styles.section} aria-label="Work experience">
      <h2 className={styles.sectionTitle}>Experience</h2>
      <div className={styles.timeline}>
        {experience.map((exp) => (
          <article key={exp.id} className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>{exp.period}</div>
            <h3 className={styles.timelineTitle}>{exp.title}</h3>
            <div className={styles.timelineCompany}>{exp.company}</div>
            <p className={styles.timelineDescription}>{exp.description}</p>
            <ul className={styles.timelineHighlights}>
              {exp.highlights.map((h, j) => (
                <li key={j} className={styles.timelineHighlight}>
                  {h}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className={styles.section} aria-label="Contact information">
      <h2 className={styles.sectionTitle}>Get In Touch</h2>
      <p className={styles.contactIntro}>
        Interested in working together? Let's connect.
      </p>
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
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'About — Sean Simpson | seantokuzo.dev'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className={styles.page}>
      <BioSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  )
}
