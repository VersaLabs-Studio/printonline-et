/**
 * Centralized authorization logic for PrintOnline.et
 * Manages admin access based on DB roles and environment variables.
 */

export function isAdmin(user: { email: string; role?: string | null } | null | undefined): boolean {
  if (!user) return false;

  // 1. Check explicit DB role
  if (user.role === "admin") return true;

  // 2. Check hardcoded admin emails from environment variables
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  if (adminEmailsEnv) {
    const adminList = adminEmailsEnv
      .split(",")
      .map((email) => email.trim().toLowerCase());
    
    if (adminList.includes(user.email.toLowerCase())) {
      return true;
    }
  }

  // 3. Emergency fallback (per master plan context if needed, but ENV is better)
  const masterAdmins = ["belaynehhenok@gmail.com", "kidus489@gmail.com"];
  if (masterAdmins.includes(user.email.toLowerCase())) {
    return true;
  }

  return false;
}
