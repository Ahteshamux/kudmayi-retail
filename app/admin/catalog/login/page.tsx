import { LoginForm } from "@/components/LoginForm";

/*
 * Rendered per request rather than prerendered. A statically cached login
 * page is served with s-maxage=31536000, and a CDN that doesn't know about
 * deploys will keep handing out year-old HTML — whose embedded Server Action
 * ids no longer exist on the server, so submitting it 404s.
 */
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-display text-brass-deep text-2xl tracking-[0.3em] uppercase">
            Kudmayi
          </h1>
          <p className="text-muted u-caps mt-3">Retail</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
