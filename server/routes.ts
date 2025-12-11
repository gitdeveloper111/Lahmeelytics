import type { Express } from "express";
import { createServer, type Server } from "http";
import { query, queryOne, testConnection } from "./db";
import bcrypt from "bcryptjs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Test database connection
  app.get("/api/health", async (_req, res) => {
    const dbConnected = await testConnection();
    res.json({ 
      status: dbConnected ? "healthy" : "unhealthy",
      database: dbConnected ? "connected" : "disconnected"
    });
  });

  // Admin login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const admin = await queryOne<{ id: number; username: string; password: string; name: string }>(
        `SELECT id, username, password, name FROM admin_users WHERE username = ?`,
        [username]
      );

      if (!admin) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Check if password matches
      // PHP bcrypt uses $2y$ prefix, Node.js bcryptjs uses $2a$ or $2b$
      // Convert PHP hash prefix to be compatible with bcryptjs
      let passwordMatch = false;
      
      try {
        // Convert PHP's $2y$ to bcryptjs-compatible $2a$ if needed
        let compatibleHash = admin.password;
        if (admin.password.startsWith('$2y$')) {
          compatibleHash = admin.password.replace(/^\$2y\$/, '$2a$');
        }
        passwordMatch = await bcrypt.compare(password, compatibleHash);
      } catch (e) {
        console.error('Bcrypt comparison error:', e);
        passwordMatch = false;
      }

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      res.json({
        success: true,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Dashboard KPIs
  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const { country, dateRange } = req.query;
      
      let countryFilter = '';
      const params: any[] = [];
      
      if (country && country !== 'all') {
        countryFilter = ' AND country = ?';
        params.push(country);
      }

      // Total users
      const totalUsers = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Signups today
      const signupsToday = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE() AND deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Active 30D (users with last_online in last 30 days)
      const active30d = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE last_online >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Premium users (from subscriptions table)
      const activePremium = await queryOne<{ count: number }>(
        `SELECT COUNT(DISTINCT s.user_id) as count 
         FROM subscriptions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.is_active = 1 AND s.expiry > NOW() AND u.deleted_at IS NULL${countryFilter.replace('country', 'u.country')}`,
        params
      );
      
      // Total matches (accepted requests)
      const totalMatches = await queryOne<{ count: number }>(
        'SELECT COUNT(*) as count FROM requests WHERE accepted_at IS NOT NULL AND deleted_at IS NULL'
      );
      
      // Gender ratio
      const womenCount = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE gender = 'female' AND deleted_at IS NULL${countryFilter}`,
        params
      );
      const menCount = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE gender = 'male' AND deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Verification queue (pending approval)
      const verificationQueue = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE status = 'pending' AND deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Deactivated users
      const deactivatedUsers = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE deactivated = 1 AND deleted_at IS NULL${countryFilter}`,
        params
      );
      
      // Verified users (not pending, not deactivated)
      const verifiedUsers = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE status != 'pending' AND deactivated = 0 AND deleted_at IS NULL${countryFilter}`,
        params
      );

      // Calculate ratio
      const women = womenCount?.count || 0;
      const men = menCount?.count || 0;
      let womenMenRatio = '1 : 1';
      if (men > 0 && women > 0) {
        const ratio = women / men;
        womenMenRatio = `${ratio.toFixed(1)} : 1`;
      }

      res.json({
        totalUsers: totalUsers?.count || 0,
        signupsToday: signupsToday?.count || 0,
        active30d: active30d?.count || 0,
        activePremium: activePremium?.count || 0,
        totalMatches: totalMatches?.count || 0,
        womenMenRatio,
        womenCount: women,
        menCount: men,
        verificationQueue: verificationQueue?.count || 0,
        deactivatedUsers: deactivatedUsers?.count || 0,
        verifiedUsers: verifiedUsers?.count || 0,
      });
    } catch (error: any) {
      console.error('KPI query error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Top active users (most recently online)
  app.get("/api/dashboard/top-users", async (_req, res) => {
    try {
      const users = await query(
        `SELECT id, first_name, last_name, code_name, email, last_online, country, gender, status
         FROM users 
         WHERE deleted_at IS NULL AND deactivated = 0
         ORDER BY last_online DESC 
         LIMIT 20`
      );
      res.json(users);
    } catch (error: any) {
      console.error('Top users query error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verification queue
  app.get("/api/dashboard/verification-queue", async (_req, res) => {
    try {
      const users = await query(
        `SELECT id, first_name, last_name, code_name, email, created_at, country, gender
         FROM users 
         WHERE status = 'pending' AND deleted_at IS NULL
         ORDER BY created_at DESC 
         LIMIT 20`
      );
      res.json(users);
    } catch (error: any) {
      console.error('Verification queue error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Daily signups trend (last 90 days)
  app.get("/api/dashboard/signups-trend", async (_req, res) => {
    try {
      const trend = await query(
        `SELECT DATE(created_at) as date, COUNT(*) as count 
         FROM users 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY) AND deleted_at IS NULL
         GROUP BY DATE(created_at) 
         ORDER BY date ASC`
      );
      res.json(trend);
    } catch (error: any) {
      console.error('Signups trend error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Users by country and gender
  app.get("/api/dashboard/users-by-country", async (_req, res) => {
    try {
      const data = await query(
        `SELECT country, gender, COUNT(*) as count 
         FROM users 
         WHERE deleted_at IS NULL AND status = 'approved'
         GROUP BY country, gender 
         ORDER BY count DESC
         LIMIT 20`
      );
      res.json(data);
    } catch (error: any) {
      console.error('Users by country error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DAU vs MAU data
  app.get("/api/dashboard/engagement", async (_req, res) => {
    try {
      // Daily active users (last 90 days)
      const dau = await query(
        `SELECT DATE(last_online) as date, COUNT(DISTINCT id) as count 
         FROM users 
         WHERE last_online >= DATE_SUB(NOW(), INTERVAL 90 DAY) AND deleted_at IS NULL
         GROUP BY DATE(last_online) 
         ORDER BY date ASC`
      );

      // Monthly active users
      const mau = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users 
         WHERE last_online >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND deleted_at IS NULL`
      );

      res.json({ 
        dau, 
        mau: mau?.count || 0 
      });
    } catch (error: any) {
      console.error('Engagement error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get single user details
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await queryOne(
        `SELECT id, first_name, last_name, code_name, email, phone, 
                country, city, gender, status, deactivated, 
                created_at, last_online, dob as date_of_birth
         FROM users 
         WHERE id = ? AND deleted_at IS NULL`,
        [id]
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get subscription info
      const subscription = await queryOne(
        `SELECT id, expiry, is_active
         FROM subscriptions 
         WHERE user_id = ? AND is_active = 1 AND expiry > NOW()
         ORDER BY expiry DESC LIMIT 1`,
        [id]
      );

      // Get match counts - wrapped in try/catch to handle potential schema differences
      let sentRequests = 0;
      let receivedRequests = 0;
      let acceptedMatches = 0;
      
      try {
        const sent = await queryOne<{ count: number }>(
          `SELECT COUNT(*) as count FROM requests WHERE sender_id = ?`,
          [id]
        );
        sentRequests = sent?.count || 0;
      } catch (e) {
        // Fallback if column names differ
        try {
          const sent = await queryOne<{ count: number }>(
            `SELECT COUNT(*) as count FROM requests WHERE id = ? LIMIT 0`,
            [id]
          );
        } catch {}
      }

      res.json({
        ...user,
        subscription: subscription || null,
        stats: {
          sentRequests,
          receivedRequests,
          acceptedMatches,
        }
      });
    } catch (error: any) {
      console.error('User details error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get list of countries for filter
  app.get("/api/countries", async (_req, res) => {
    try {
      const countries = await query(
        `SELECT DISTINCT country, COUNT(*) as userCount 
         FROM users 
         WHERE deleted_at IS NULL AND country IS NOT NULL AND country != ''
         GROUP BY country 
         ORDER BY userCount DESC`
      );
      res.json(countries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
