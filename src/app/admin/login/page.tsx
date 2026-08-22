import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in — Admin" };

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const notAuthorized = searchParams?.error === "not-authorized";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-admin-border bg-admin-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-admin-text">Dr. Hussein Zakaria</h1>
          <p className="mt-1 text-sm text-admin-muted">Admin dashboard sign in</p>
        </div>
        {notAuthorized && (
          <p className="mb-4 rounded-lg border border-admin-danger/30 bg-red-50 px-3 py-2 text-sm text-admin-danger">
            That account isn&apos;t authorized for the admin dashboard.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
