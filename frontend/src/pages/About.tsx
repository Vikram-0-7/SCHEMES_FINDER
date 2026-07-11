import { Shield, Users, BookOpen, Heart, Code, Globe } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about" id="about-page">
      {/* Hero */}
      <section className="about__hero" id="about-hero">
        <div className="container text-center">
          <h1 className="heading-xl">
            Bridging the Gap Between
            <br />
            <span className="about__accent">Citizens and Government</span>
          </h1>
          <p className="text-body" style={{ maxWidth: 600, margin: '16px auto 0' }}>
            We believe that every citizen deserves easy, understandable access to
            the welfare schemes and rights designed for their benefit.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section" id="about-mission">
        <div className="container">
          <div className="about__grid">
            <div className="about__card card">
              <div className="card-body">
                <div className="about__icon">
                  <Shield size={28} />
                </div>
                <h3 className="heading-sm">Our Mission</h3>
                <p className="text-body">
                  To demystify bureaucratic language and make government entitlements
                  accessible to everyone, regardless of their background, education, or
                  language proficiency. We parse through complex legal text so you don't have to.
                </p>
              </div>
            </div>

            <div className="about__card card">
              <div className="card-body">
                <div className="about__icon about__icon--purple">
                  <Users size={28} />
                </div>
                <h3 className="heading-sm">For the People</h3>
                <p className="text-body">
                  Built with a focus on accessibility, offering multilingual support
                  and text-to-speech for those who need it most. Every Indian citizen
                  deserves to know their rights and entitlements.
                </p>
              </div>
            </div>

            <div className="about__card card">
              <div className="card-body">
                <div className="about__icon about__icon--green">
                  <BookOpen size={28} />
                </div>
                <h3 className="heading-sm">Trusted Information</h3>
                <p className="text-body">
                  We aggregate and simplify information directly from official government
                  portals to ensure accuracy and reliability. Every scheme listing is
                  sourced from verified government databases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--gray-50)' }} id="about-values">
        <div className="container text-center">
          <h2 className="heading-lg" style={{ marginBottom: 40 }}>Our Values</h2>
          <div className="about__values-grid">
            <div className="about__value">
              <div className="about__value-icon"><Heart size={24} /></div>
              <h4 className="heading-sm">Empathy First</h4>
              <p className="text-sm">Designed with the end user in mind — citizens who may be navigating the system for the first time.</p>
            </div>
            <div className="about__value">
              <div className="about__value-icon"><Code size={24} /></div>
              <h4 className="heading-sm">Open Source</h4>
              <p className="text-sm">Our entire codebase is open source. We believe in transparency and community-driven development.</p>
            </div>
            <div className="about__value">
              <div className="about__value-icon"><Globe size={24} /></div>
              <h4 className="heading-sm">Inclusive Access</h4>
              <p className="text-sm">Available to all, in multiple languages, with accessibility features for diverse users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" id="about-tech">
        <div className="container text-center">
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>Built With Modern Tech</h2>
          <p className="text-body" style={{ maxWidth: 500, margin: '0 auto 40px' }}>
            Leveraging the best tools to deliver a fast, reliable, and intelligent experience.
          </p>
          <div className="about__tech-badges">
            {['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Groq AI', 'Vite'].map((tech) => (
              <span key={tech} className="about__tech-badge">{tech}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
