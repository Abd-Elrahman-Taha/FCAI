import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../icons/Icon';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

export type Crumb = {
  label: string;
  href?: string;
} | [string, string?];

interface PageHeadProps {
  title: string;
  desc?: string;
  subtitle?: string;
  crumbs?: Crumb[];
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}

/** Visual identity per portal role (icon + label shown in the header chip) */
const ROLE_META: Record<Role, { label: string; icon: string }> = {
  student: { label: 'Student Portal', icon: 'graduation' },
  doctor: { label: 'Faculty Portal', icon: 'briefcase' },
  ta: { label: 'Teaching Assistant Portal', icon: 'users' },
  admin: { label: 'Administration Portal', icon: 'shield' },
  employee: { label: 'Staff Portal', icon: 'idCard' },
};

const formatToday = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export const PageHead: React.FC<PageHeadProps> = ({ title, desc, subtitle, crumbs, breadcrumbs, actions }) => {
  const { role } = useAuth();
  const rawCrumbs = breadcrumbs || crumbs;
  const effectiveDesc = subtitle || desc;
  const meta = ROLE_META[role] || ROLE_META.student;

  const normalizedCrumbs = rawCrumbs?.map(c => (Array.isArray(c) ? { label: c[0], href: c[1] } : c));

  return (
    <motion.section
      className="portal-hero"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Decorative layers */}
      <span className="portal-hero-glow" aria-hidden="true" />
      <span className="portal-hero-grid" aria-hidden="true" />

      <div className="portal-hero-top">
        <span className="portal-hero-chip">
          <Icon name={meta.icon} size="sm" />
          {meta.label}
        </span>
        <span className="portal-hero-date">
          <span className="portal-hero-pulse" aria-hidden="true" />
          {formatToday()}
        </span>
      </div>

      {normalizedCrumbs && normalizedCrumbs.length > 0 && (
        <nav className="crumbs portal-hero-crumbs" aria-label="Breadcrumb">
          {normalizedCrumbs.map((crumb, idx) => {
            const isLast = idx === normalizedCrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label + idx}>
                {idx > 0 && <Icon name="chevronRight" size="sm" className="sep" />}
                {crumb.href && !isLast ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span className={isLast ? 'cur' : ''}>{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="page-head portal-hero-body">
        <div>
          <h1 className="portal-hero-title">{title}</h1>
          {effectiveDesc && <p>{effectiveDesc}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </motion.section>
  );
};
