import { requirePage } from '@/lib/auth';
import { ROLE_LABEL, ROLE_SUMMARY } from '@/lib/permissions';
import { PageHead } from '@/components/Shell';
import PasswordForm from './PasswordForm';

export const metadata = { title: 'My account' };

export default async function AccountPage() {
  const me = await requirePage();
  return (
    <>
      <PageHead title="My account" />
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-body">
          <dl className="kv" style={{ margin: 0 }}>
            <dt>Name</dt><dd>{me.name}</dd>
            <dt>Email</dt><dd>{me.email}</dd>
            <dt>Role</dt><dd>{ROLE_LABEL[me.role]}<div className="small muted">{ROLE_SUMMARY[me.role]}</div></dd>
          </dl>
        </div>
        <PasswordForm />
      </div>
    </>
  );
}
