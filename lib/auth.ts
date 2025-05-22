import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server
 */
export async function getSession() {
  return await getServerSession();
}

/**
 * Check if the user is authenticated on the server
 * If not, redirect to the login page
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
}

/**
 * Check if the user has the required role
 * If not, redirect to the dashboard
 */
export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}

/**
 * Check if user is an admin
 * If not, redirect to the dashboard
 */
export async function requireAdmin() {
  return requireRole(["admin"]);
}
