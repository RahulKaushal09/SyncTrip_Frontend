"use client";

import React, { useEffect, useState } from 'react';
import {
  MapPin, Clock, Users, CalendarDays, Ticket,
  Trophy, Coffee, Bike, ChevronRight, X, ArrowRight
} from 'lucide-react';
import './activities.css';
import { SportsPlan, MoviePlan, HangoutPlan, RidePlan, LOCATIONS } from "../../../types/common.types";
import { ApiService } from '@/utils';
import { DownloadAppModal } from '@/components/Download App/DownloadAppModal';
import GumletImage from '@/components/common/GumletImage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (iso: string | null) => {
  if (!iso) return { day: '–', month: 'TBA', weekday: '' };
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
  };
};

// ─── Date badge (floats on card image) ────────────────────────────────────────

const DateBadge: React.FC<{ iso: string | null }> = ({ iso }) => {
  const { day, month } = fmt(iso);
  return (
    <div className="img-date-badge" style={{ zIndex: 100 }}>
      <span className="badge-month">{month}</span>
      <span className="badge-day">{day}</span>
    </div>
  );
};

// ─── Cards ────────────────────────────────────────────────────────────────────

const RideCard: React.FC<{ data: RidePlan }> = ({ data }) => (
  <div className="plan-card">
    <div className="card-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
      {data.rideImage && (
        <GumletImage
          src={data.rideImage}
          containerClassName='h-full'
          alt={data.title}
          fill
          fetchPriority="high"
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
      )}
      <DateBadge iso={data.scheduleDate} />
    </div>
    <div className="card-body">
      <h3 className="card-name">{data.title}</h3>
      <p className="card-venue">
        <MapPin size={12} /> {data.startLocationName || 'Location TBD'}
      </p>
      <div className="card-tags">
        {data.locationName && <span className="tag"><MapPin size={11} /> {data.locationName}</span>}
        {data.totalDays && <span className="tag"><Clock size={11} /> {data.totalDays}d</span>}
        {data.bikeCC && <span className="tag"><Bike size={11} /> {data.bikeCC}</span>}
      </div>
      <div className="card-footer">
        <span className="members-pill" style={{ color: 'var(--primary)' }}>
          <Users size={13} /> {data.membersCount ?? 0} / {data.maxMembers ?? '–'} joined
        </span>
      </div>
    </div>
  </div>
);

const MovieCard: React.FC<{ data: MoviePlan }> = ({ data }) => {
  const pct = Math.min(((data.membersCount ?? 0) / (data.maxMembers ?? 1)) * 100, 100);
  return (
    <div className="plan-card">
      <div className="card-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
        {data.movieImage && (
          <GumletImage
            src={data.movieImage}
            containerClassName='h-full'
            alt={data.title}
            fill
            fetchPriority="high"
            style={{ objectFit: 'cover', zIndex: 0 }}
          />
        )}
        <DateBadge iso={data.scheduleDate} />
        {data.scheduleTime && (
          <div className="card-scrim" style={{ position: 'relative', zIndex: 10 }}>
            <Clock size={11} /> {data.scheduleTime}
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">{data.title}</h3>
        <p className="card-venue">
          <Ticket size={12} /> {data.venueName || 'Venue TBD'}
        </p>
        <div className="card-tags">
          {data.locationName && <span className="tag"><MapPin size={11} /> {data.locationName}</span>}
          {data.distance != null && <span className="tag">{data.distance} km</span>}
        </div>
        <div className="progress-wrap">
          <div className="progress-row">
            <span>Filling fast</span>
            <span style={{ color: 'var(--red)' }}>{data.membersCount ?? 0}/{data.maxMembers ?? '–'}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SportCard: React.FC<{ data: SportsPlan }> = ({ data }) => (
  <div className="plan-card">
    <div className="card-thumb-icon" style={{ background: 'var(--green-bg)' }}>
      <div className="card-icon-wrap" style={{ background: 'var(--green-bg)' }}>
        <Trophy size={28} color="var(--green)" />
      </div>
      <DateBadge iso={data.scheduleDate} />
    </div>
    <div className="card-body">
      <h3 className="card-name">{data.sportType.toUpperCase()} Match</h3>
      <p className="card-venue">
        <MapPin size={12} /> {data.venueName || 'Venue TBD'}
      </p>
      <div className="card-tags">
        {data.scheduleTime && <span className="tag"><Clock size={11} /> {data.scheduleTime}</span>}
      </div>
      <div className="card-footer">
        <span className="members-pill" style={{ color: 'var(--green)' }}>
          <Users size={13} /> {data.membersCount ?? 0} / {data.maxMembers ?? '–'} joined
        </span>
      </div>
    </div>
  </div>
);

const HangoutCard: React.FC<{ data: HangoutPlan }> = ({ data }) => (
  <div className="plan-card">
    <div className="card-thumb-icon" style={{ background: 'var(--amber-bg)' }}>
      <div className="card-icon-wrap">
        <Coffee size={28} color="var(--amber)" />
      </div>
      <DateBadge iso={data.scheduleDate} />
    </div>
    <div className="card-body">
      <h3 className="card-name">{data.outingType.split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} Hangout</h3>
      <p className="card-venue">
        <MapPin size={12} /> {data.venueName || 'Venue TBD'}
      </p>
      <div className="card-tags">
        {data.scheduleTime && <span className="tag"><Clock size={11} /> {data.scheduleTime}</span>}
      </div>
      <div className="card-footer">
        <span className="members-pill" style={{ color: 'var(--amber)' }}>
          <Users size={13} /> {data.membersCount ?? 0} / {data.maxMembers ?? '–'} joined
        </span>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExploreActivities() {
  const [loc, setLoc] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [rides, setRides] = useState<RidePlan[]>([]);
  const [movies, setMovies] = useState<MoviePlan[]>([]);
  const [sports, setSports] = useState<SportsPlan[]>([]);
  const [hangouts, setHangouts] = useState<HangoutPlan[]>([]);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [r, m, s, h] = await Promise.all([
          ApiService.getRidePlans(),
          ApiService.getMoviesPlans(),
          ApiService.getSportsPlans(),
          ApiService.getHangoutPlans(),
        ]);
        setRides(r); setMovies(m); setSports(s); setHangouts(h);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const filter = <T extends { locationName?: string | null }>(list: T[]) =>
    loc ? list.filter(d => d.locationName === loc) : list;

  const mkLink = (cat: string) =>
    `/explore/plans?cat=${cat}${loc ? `&location=${loc}` : ''}`;

  // Section definitions — only render when items exist
  const sections = [
    {
      key: 'rides',
      label: 'Upcoming Rides',
      icon: <Bike size={13} />,
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
      cat: 'rides',
      items: filter(rides),
      render: (d: RidePlan) => <RideCard key={d.id} data={d} />,
    },
    {
      key: 'movies',
      label: 'Movie Plans',
      icon: <Ticket size={13} />,
      color: 'var(--red)',
      bg: 'var(--red-bg)',
      cat: 'movies',
      items: filter(movies),
      render: (d: MoviePlan) => <MovieCard key={d.id} data={d} />,
    },
    {
      key: 'sports',
      label: 'Sports Matches',
      icon: <Trophy size={13} />,
      color: 'var(--green)',
      bg: 'var(--green-bg)',
      cat: 'sports',
      items: filter(sports),
      render: (d: SportsPlan) => <SportCard key={d.id} data={d} />,
    },
    {
      key: 'hangouts',
      label: 'Casual Hangouts',
      icon: <Coffee size={13} />,
      color: 'var(--amber)',
      bg: 'var(--amber-bg)',
      cat: 'hangouts',
      items: filter(hangouts),
      render: (d: HangoutPlan) => <HangoutCard key={d.id} data={d} />,
    },
  ] as const;

  const visible = sections.filter(s => s.items.length > 0);

  return (
    <div className="activities-page-wrapper">
      <DownloadAppModal isOpen={showDownload} onClose={() => setShowDownload(false)} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Activities</h1>
          <p className="page-subtitle">Find your next adventure and crew</p>
        </div>
        <button className="location-btn" onClick={() => setModal(true)}>
          <MapPin size={16} />
          {loc || 'All Locations'}
          <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Sections */}
      <div className="sections-container">
        {visible.length === 0 ? (
          <div className="empty-state">
            No plans found{loc ? ` in ${loc}` : ''}. Try a different city.
          </div>
        ) : (
          visible.map(sec => (
            <section onClick={() => setShowDownload(true)} key={sec.key} className="activity-section">
              {/* Section header */}
              <div className="section-header">
                <span
                  className="section-label-pill"
                  style={{ color: sec.color, background: sec.bg }}
                >
                  {sec.icon} {sec.label}
                </span>
                <div className="section-rule" />
                {sec.items.length > 3 && (
                  <a href={mkLink(sec.cat)} className="see-more-btn">
                    See all <ArrowRight size={13} />
                  </a>
                )}
              </div>

              {/* Cards — always max 3 */}
              <div className="activity-grid">
                {sec.items.slice(0, 3).map(item => sec.render(item as never))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Location modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Select City</h3>
              <button className="close-btn" onClick={() => setModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="chips">
              <button
                className={`chip${loc === null ? ' active' : ''}`}
                onClick={() => { setLoc(null); setModal(false); }}
              >
                Everywhere
              </button>
              {LOCATIONS.map(l => (
                <button
                  key={l}
                  className={`chip${loc === l ? ' active' : ''}`}
                  onClick={() => { setLoc(l); setModal(false); }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}