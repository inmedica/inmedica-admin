import Link from 'next/link';
import { requirePage } from '@/lib/auth';
import { PAGE_SCHEMAS } from '@/lib/content-schema';
import { fmtDateTime } from '@/lib/util';
import { WEBSITE_URL } from '@/lib/website';
import { Page } from '@/models';
import { PageHead } from '@/components/Shell';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Pages & Content' };

export default async function ContentIndex() {
  await requirePage('content.edit');
  const pages = await Page.find().select('key hasDraft isPublished publishedAt updatedAt updatedBy').lean();
  const byKey = Object.fromEntries(pages.map(p => [p.key, p]));
  return (
    <>
      <PageHead title="Pages & Content" sub="Edit the text, images and documents on each website page. Changes are saved as drafts until published." />
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Page</th><th>Status</th><th>Last change</th><th></th></tr></thead>
            <tbody>
              {PAGE_SCHEMAS.map(s => {
                const p = byKey[s.key];
                return (
                  <tr key={s.key}>
                    <td>
                      <Link href={`/content/${s.key}`} className="row" style={{ flexWrap: 'nowrap', color: 'inherit' }}>
                        <Icon name={s.icon} style={{ color: 'var(--teal)' }} />
                        <span><b>{s.label}</b><div className="small muted">{s.intro}</div></span>
                      </Link>
                    </td>
                    <td className="nowrap">
                      {!p ? <span className="badge">Website default</span> : (<>
                        <span className={'badge ' + (p.isPublished ? 'b-published' : 'b-archived')}>{p.isPublished ? 'Live' : 'Switched off'}</span>{' '}
                        {p.hasDraft && <span className="badge b-draft">Unpublished draft</span>}
                      </>)}
                    </td>
                    <td className="small">{p ? <>{fmtDateTime(p.updatedAt)}{p.updatedBy && <div className="muted">{p.updatedBy}</div>}</> : '—'}</td>
                    <td className="nowrap">
                      <Link href={`/content/${s.key}`} className="btn btn-sm"><Icon name="edit" />Edit</Link>
                      <a href={WEBSITE_URL + s.path} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost btn-icon" title="View live page"><Icon name="open_in_new" /></a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="help" style={{ marginTop: 10 }}>Products, categories and brands are edited under Catalogue. Contact details, logo and social links are in Settings.</p>
    </>
  );
}
