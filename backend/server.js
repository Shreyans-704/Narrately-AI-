const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the Firebase-hosted frontend and localhost dev
app.use(
  cors({
    origin: [
      "https://narrately.online",
      "https://www.narrately.online",
      /^http:\/\/localhost:\d+$/,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Supabase admin client (service_role, bypasses RLS) ────────────────────────
function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Narrately Backend Running 🚀" });
});

app.get("/api/ping", (_req, res) => {
  res.json({ message: process.env.PING_MESSAGE ?? "ping" });
});

// ── POST /api/signup ──────────────────────────────────────────────────────────
app.post("/api/signup", async (req, res) => {
  const { userId, email, fullName, avatarUrl, setDefaultPassword } = req.body;

  if (!userId || !email || !fullName) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const supabase = getAdminClient();
    const trialEndDate = new Date();
    trialEndDate.setMonth(trialEndDate.getMonth() + 3);

    const { data: upsertData, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl ?? null,
          role: "user",
          status: "inactive",
          credit_balance: 30,
          total_views: 0,
          onboarding_completed: false,
          trial_ends_at: trialEndDate.toISOString(),
        },
        { onConflict: "id", ignoreDuplicates: true }
      )
      .select();

    if (error) {
      console.error("Profile creation error:", error);
      if (
        error.message &&
        (error.message.includes("duplicate key") ||
          error.message.includes("profiles_email_key"))
      ) {
        res.status(409).json({ error: "This email is already registered. Please sign in instead." });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }

    let data = upsertData && upsertData.length > 0 ? upsertData[0] : null;
    if (!data) {
      const { data: existing, error: existErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (existErr || !existing) {
        console.error("Failed to fetch existing profile:", existErr);
        res.status(500).json({ error: "Profile creation failed" });
        return;
      }
      data = existing;
    }

    if (setDefaultPassword) {
      const { error: pwError } = await supabase.auth.admin.updateUserById(userId, {
        password: "Narrately@first123",
      });
      if (pwError) {
        console.warn("Could not set default password:", pwError.message);
      }
    }

    res.json({ user: data, error: null });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/admin-login ─────────────────────────────────────────────────────
const ADMIN_USERNAME = "Admin@Narrately";
const ADMIN_PASSWORD = "Admin@2026";

app.post("/api/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      user: { username, role: "admin", message: "Admin authenticated successfully" },
    });
    return;
  }
  res.status(401).json({ error: "Invalid admin credentials" });
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
app.get("/api/admin/users", async (_req, res) => {
  try {
    const supabase = getAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authError) throw authError;

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, role, credit_balance, avatar_url, trial_ends_at");
    if (profilesError) throw profilesError;

    let avatarGroupMap = new Map();
    let statusMap = new Map();
    try {
      const { data: agData } = await supabase
        .from("profiles")
        .select("id, avatar_group_id, status");
      if (agData) {
        agData.forEach((row) => {
          avatarGroupMap.set(row.id, row.avatar_group_id ?? null);
          statusMap.set(row.id, row.status ?? "inactive");
        });
      }
    } catch (_) {}

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const users = (authData?.users || []).map((u) => {
      const profile = profileMap.get(u.id);
      const providers = (u.identities || []).map((id) => id.provider);
      const providerType = providers.includes("google") || providers.includes("github")
        ? "Social"
        : providers.includes("email")
        ? "Email"
        : "-";

      return {
        id: u.id,
        email: u.email || "-",
        phone: u.phone || "-",
        display_name:
          profile?.full_name ||
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          "-",
        avatar_url: profile?.avatar_url || u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
        avatar_group_id: avatarGroupMap.get(u.id) ?? null,
        status: statusMap.get(u.id) ?? "inactive",
        providers,
        provider_type: providerType,
        role: profile?.role || "user",
        credit_balance: profile?.credit_balance ?? 0,
        trial_ends_at: profile?.trial_ends_at || null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
      };
    });

    res.json({ users });
  } catch (err) {
    console.error("[admin-users]", err);
    res.status(500).json({ error: err.message || "Failed to fetch users" });
  }
});

// ── PATCH /api/admin/users/:id/credits ────────────────────────────────────────
app.patch("/api/admin/users/:id/credits", async (req, res) => {
  try {
    const { id } = req.params;
    const { credit_balance } = req.body;
    if (typeof credit_balance !== "number" || credit_balance < 0) {
      res.status(400).json({ error: "Invalid credit_balance value" });
      return;
    }
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ credit_balance, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: "User profile not found" });
      return;
    }
    res.json({ user: data[0] });
  } catch (err) {
    console.error("[update-credits]", err);
    res.status(500).json({ error: err.message || "Failed to update credits" });
  }
});

// ── PATCH /api/admin/users/:id/role ──────────────────────────────────────────
app.patch("/api/admin/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: "User profile not found" });
      return;
    }
    res.json({ user: data[0] });
  } catch (err) {
    console.error("[update-role]", err);
    res.status(500).json({ error: err.message || "Failed to update role" });
  }
});

// ── PATCH /api/admin/users/:id/avatar-group ───────────────────────────────────
app.patch("/api/admin/users/:id/avatar-group", async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_group_id } = req.body;
    const newStatus = avatar_group_id ? "active" : "inactive";
    const supabase = getAdminClient();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(id);
      if (authErr || !authUser?.user) {
        res.status(404).json({ error: "Auth user not found" });
        return;
      }
      const u = authUser.user;
      const meta = u.user_metadata || {};
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 3);
      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id,
        email: u.email ?? "",
        full_name: meta.full_name || meta.name || u.email?.split("@")[0] || "User",
        avatar_url: meta.avatar_url || meta.picture || null,
        role: "user",
        status: newStatus,
        avatar_group_id: avatar_group_id || null,
        credit_balance: 30,
        total_views: 0,
        onboarding_completed: false,
        trial_ends_at: trialEnd.toISOString(),
        created_at: u.created_at,
      }, { onConflict: "id" });
      if (upsertErr) throw upsertErr;
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_group_id: avatar_group_id || null, status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    }

    const { data: final, error: fetchErr } = await supabase
      .from("profiles").select("*").eq("id", id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!final) { res.status(500).json({ error: "Failed to retrieve updated profile" }); return; }
    res.json({ user: final });
  } catch (err) {
    console.error("[update-avatar-group]", err);
    res.status(500).json({ error: err.message || "Failed to update avatar group" });
  }
});

// ── PATCH /api/admin/users/:id/status ────────────────────────────────────────
app.patch("/api/admin/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      res.status(400).json({ error: 'status must be "active" or "inactive"' });
      return;
    }
    const supabase = getAdminClient();
    const { data: existing } = await supabase
      .from("profiles").select("id").eq("id", id).maybeSingle();

    if (!existing) {
      const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(id);
      if (authErr || !authUser?.user) {
        res.status(404).json({ error: "Auth user not found" });
        return;
      }
      const u = authUser.user;
      const meta = u.user_metadata || {};
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 3);
      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id,
        email: u.email ?? "",
        full_name: meta.full_name || meta.name || u.email?.split("@")[0] || "User",
        avatar_url: meta.avatar_url || meta.picture || null,
        role: "user",
        status,
        credit_balance: 30,
        total_views: 0,
        onboarding_completed: false,
        trial_ends_at: trialEnd.toISOString(),
        created_at: u.created_at,
      }, { onConflict: "id" });
      if (upsertErr) throw upsertErr;
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    }

    const { data: final, error: fetchErr } = await supabase
      .from("profiles").select("*").eq("id", id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!final) { res.status(500).json({ error: "Failed to retrieve updated profile" }); return; }
    res.json({ user: final });
  } catch (err) {
    console.error("[update-status]", err);
    res.status(500).json({ error: err.message || "Failed to update status" });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("[delete-user]", err);
    res.status(500).json({ error: err.message || "Failed to delete user" });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Narrately API running on port ${PORT}`);
});
