import { ConsolePage } from '@/components/ConsolePage';
import { membershipShortcodeMap } from '@/lib/acc-content';
import { getMembersBridgeSnapshot } from '@/lib/members-bridge';

function statusClass(ok: boolean) {
  return ok
    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
    : 'border-amber-400/20 bg-amber-400/10 text-amber-100';
}

export default async function Page() {
  const bridge = await getMembersBridgeSnapshot();
  const health = bridge.health.data;
  const manifest = bridge.manifest.data;
  const pages = manifest?.pages ? Object.values(manifest.pages) : [];
  const managedPages = pages.filter((page) => ['managed', 'created', 'updated'].includes(page.status)).length;

  return (
    <ConsolePage href="/members">
      <div className="space-y-5">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-950/50 to-amber-300/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">OneGodian Members & Community</p>
          <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">Membership command center</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            Monitor the WordPress membership plugin, managed pages, WooCommerce account layer, BuddyPress/BuddyBoss social compatibility, API bridge, and shortcode surfaces from app.OneGodian.com.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className={`rounded-2xl border p-4 ${statusClass(bridge.health.ok)}`}>
            <p className="text-xs font-black uppercase tracking-wider">WordPress Bridge</p>
            <p className="mt-2 text-2xl font-black">{bridge.health.ok ? 'Connected' : 'Check'}</p>
            <p className="mt-1 text-xs opacity-80">{health?.version ? `Plugin v${health.version}` : bridge.health.error || 'No response'}</p>
          </div>
          <div className={`rounded-2xl border p-4 ${statusClass(Boolean(health?.woocommerce))}`}>
            <p className="text-xs font-black uppercase tracking-wider">WooCommerce</p>
            <p className="mt-2 text-2xl font-black">{health?.woocommerce ? 'Connected' : 'Optional'}</p>
            <p className="mt-1 text-xs opacity-80">Login, registration, orders, downloads, and My Account.</p>
          </div>
          <div className={`rounded-2xl border p-4 ${statusClass(Boolean(health?.buddypress))}`}>
            <p className="text-xs font-black uppercase tracking-wider">Social Community</p>
            <p className="mt-2 text-2xl font-black">{health?.buddypress ? 'Connected' : 'Optional'}</p>
            <p className="mt-1 text-xs opacity-80">Profiles, members, activity, groups, messages, and notifications.</p>
          </div>
          <div className={`rounded-2xl border p-4 ${statusClass(bridge.bridgeConfigured && bridge.sync.ok)}`}>
            <p className="text-xs font-black uppercase tracking-wider">App Sync</p>
            <p className="mt-2 text-2xl font-black">{bridge.bridgeConfigured && bridge.sync.ok ? 'Ready' : 'Configure'}</p>
            <p className="mt-1 text-xs opacity-80">Server-side bridge key and sync-status endpoint.</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Managed Pages</p>
                <h2 className="mt-1 text-xl font-black text-white">{managedPages} / {pages.length || 14} synchronized</h2>
              </div>
              <a href="/api/members/manifest" className="rounded-full border border-white/10 px-3 py-2 text-xs font-black text-white">Manifest</a>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(pages.length ? pages.slice(0, 8) : [
                { title: 'Member Dashboard', shortcode: '[onegodian_member_dashboard_shell]', status: 'awaiting live bridge', url: '#' },
                { title: 'Member Account', shortcode: '[onegodian_my_account]', status: 'awaiting live bridge', url: '#' },
                { title: 'Member Profile', shortcode: '[onegodian_member_profile]', status: 'awaiting live bridge', url: '#' },
                { title: 'Community', shortcode: '[onegodian_community_hub]', status: 'awaiting live bridge', url: '#' }
              ]).map((page) => (
                <a key={`${page.title}-${page.shortcode}`} href={page.url || '#'} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:border-amber-200/30">
                  <p className="font-black text-white">{page.title}</p>
                  <code className="mt-1 block break-words text-[11px] text-amber-100">{page.shortcode}</code>
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-slate-400">{page.status}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">API & Sync</p>
            <h2 className="mt-1 text-xl font-black text-white">Server-side membership bridge</h2>
            <div className="mt-4 space-y-2 text-sm">
              <code className="block rounded-xl border border-white/10 bg-black/30 p-3 text-amber-100">/api/members/health</code>
              <code className="block rounded-xl border border-white/10 bg-black/30 p-3 text-amber-100">/api/members/manifest</code>
              <code className="block rounded-xl border border-white/10 bg-black/30 p-3 text-amber-100">/api/members/sync-status</code>
              <code className="block rounded-xl border border-white/10 bg-black/30 p-3 text-slate-300">{bridge.baseUrl}</code>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              The bridge key stays server-side. WordPress exposes public-safe health/manifest data and protects sync-status with X-OneGodian-Members-Key.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/35 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Shortcode Registry</p>
          <h2 className="mt-1 text-xl font-black text-white">Membership, profile, community, and account surfaces</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {membershipShortcodeMap.map((item) => (
              <div key={item.shortcode} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">{item.label}</p>
                <code className="mt-2 block break-words text-xs text-amber-100">{item.shortcode}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ConsolePage>
  );
}
