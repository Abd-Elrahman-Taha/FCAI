import React from 'react';
import { Icon } from '../icons/Icon';

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

export const PageHead: React.FC<PageHeadProps> = ({ title, desc, subtitle, crumbs, breadcrumbs, actions }) => {
  const rawCrumbs = breadcrumbs || crumbs;
  const effectiveDesc = subtitle || desc;

  const normalizedCrumbs = rawCrumbs?.map(c => {
    if (Array.isArray(c)) {
      return { label: c[0], href: c[1] };
    }
    return c;
  });

  return (
    <div style={{ marginBottom: '22px' }}>
      {normalizedCrumbs && normalizedCrumbs.length > 0 && (
        <nav className="crumbs" aria-label="Breadcrumb">
          {normalizedCrumbs.map((crumb, idx) => {
            const isLast = idx === normalizedCrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label + idx}>
                {idx > 0 && <span className="sep">/</span>}
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

      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <h1>{title}</h1>
          {effectiveDesc && <p>{effectiveDesc}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </div>
  );
};
