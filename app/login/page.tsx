import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-display text-brass text-2xl tracking-[0.3em] uppercase">
            Kudmayi
          </h1>
          <p className="text-muted u-caps mt-3">Retail</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
