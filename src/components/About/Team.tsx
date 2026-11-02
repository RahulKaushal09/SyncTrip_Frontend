import React from "react";
import styles from "./Team.module.css";

/**
 * Founder and company facts for /about#team.
 *
 * Programs like Google for Startups verify a company by its public site, so the
 * founding team, the legal entity and a way to reach them have to be on a page
 * anyone can open. Keep this in step with the DPIIT deck.
 */

export const COMPANY = {
  legalName: "SyncTrip Digital Private Limited",
  brand: "SyncTrip",
  email: "synctripofficial@gmail.com",
  linkedin: "https://www.linkedin.com/company/synctrip",
  site: "https://synctrip.in",
};

export const FOUNDERS = [
  {
    name: "Rahul Kaushal",
    role: "Founder & Director",
    photo: "/home/founder-rahul-kaushal.webp",
    bio: "Full-stack engineer and SyncTrip’s technical founder. Before SyncTrip he was an SDE-1 at EduRev (Y Combinator S20). B.Tech in Aerospace Engineering from Punjab Engineering College, Chandigarh (2024). He built SyncTrip’s app, website and backend in-house and leads product, engineering and partnerships.",
    focus: ["Product & engineering", "Club partnerships", "Company strategy"],
  },
];

export default function Team() {
  return (
    <section id="team" className={styles.section} aria-labelledby="team-title">
      <div className={styles.inner}>
        <span className={styles.kicker}>Founder &amp; team</span>
        <h2 id="team-title" className={styles.h2}>The people behind SyncTrip</h2>
        <p className={styles.lead}>
          SyncTrip is built by {COMPANY.legalName}, a DPIIT-recognised startup based in Chandigarh, India. We build the
          app, the website and the club platform in-house, with a small team of interns, and work with partner clubs
          that host events in Chandigarh and Delhi NCR.
        </p>

        {FOUNDERS.map((f) => (
          <article key={f.name} className={styles.card}>
            {/* eslint-disable-next-line @next/next/no-img-element -- small static portrait */}
            <img src={f.photo} alt={`${f.name}, ${f.role} of SyncTrip`} className={styles.photo} width={220} height={202} />
            <div className={styles.body}>
              <h3 className={styles.name}>{f.name}</h3>
              <p className={styles.role}>{f.role}, {COMPANY.brand}</p>
              <p className={styles.bio}>{f.bio}</p>
              <ul className={styles.focus}>
                {f.focus.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <dl className={styles.facts}>
          <div>
            <dt>Company</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt>Recognition</dt>
            <dd>DPIIT-recognised startup (Startup India)</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Chandigarh, India · operating in Chandigarh Tricity and Delhi NCR</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> ·{" "}
              <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
