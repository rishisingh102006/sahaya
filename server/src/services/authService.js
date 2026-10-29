import { db } from '../database/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { generateId } from '../utils/idGenerator.js';
import { ROLE_ALIASES } from '../config/constants.js';
import { getSupabase, isSupabaseConfigured } from '../database/supabaseClient.js';

export const authService = {
  async register(userData) {
    const { email, password, role = 'senior', name, ...rest } = userData;

    const normalizedRole = ROLE_ALIASES[role] || role;
    const VALID_ROLES = ['senior', 'ngo', 'volunteer'];
    if (!VALID_ROLES.includes(normalizedRole)) {
      const error = new Error('Invalid account role specified. Allowed roles: senior, ngo, volunteer');
      error.statusCode = 400;
      throw error;
    }
    const existing = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password || 'Sahaya@123');
    const id = generateId(`user-${normalizedRole}`);

    const newUser = {
      id,
      name,
      email: email.toLowerCase(),
      role: normalizedRole,
      password: hashedPassword,
      ...rest,
      createdAt: new Date().toISOString(),
    };

    // Synchronize to Supabase Auth (Users section in Supabase Dashboard)
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newUser.email,
            password: password || 'Sahaya@123',
            options: {
              data: {
                name: newUser.name,
                role: newUser.role,
                phone: rest.phone || '',
              },
            },
          });
          if (authError) {
            console.warn(`[Supabase Auth] Notice for ${newUser.email}:`, authError.message);
          } else if (authData?.user) {
            console.log(`[Supabase Auth] User '${newUser.email}' registered in Supabase Auth (ID: ${authData.user.id})`);
          }
        }
      } catch (authErr) {
        console.warn(`[Supabase Auth] Registration notice:`, authErr.message);
      }
    }

    await db.insert('users', newUser);

    // If volunteer, also register in volunteers directory
    if (normalizedRole === 'volunteer') {
      const newVol = {
        id: `vol-${Date.now().toString(36)}`,
        name,
        email: email.toLowerCase(),
        phone: rest.phone || '',
        city: rest.city || '',
        state: rest.state || '',
        skills: rest.skills || ['General Assistance'],
        rating: 5.0,
        activeTasks: 0,
        completedTasks: 0,
        verified: false,
      };
      await db.insert('volunteers', newVol);
    }

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  },

  async login(email, password, requestedRole) {
    const user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const normalizedRole = ROLE_ALIASES[user.role] || user.role;

    // If role requested doesn't match normalized user role, check alias
    if (requestedRole) {
      const normalizedRequested = ROLE_ALIASES[requestedRole] || requestedRole;
      if (normalizedRequested !== normalizedRole) {
        const error = new Error('Invalid credentials or account role mismatch');
        error.statusCode = 403;
        throw error;
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: normalizedRole,
      name: user.name,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: { ...userWithoutPassword, role: normalizedRole }, token };
  },

  async getMe(userId) {
    const user = db.findById('users', userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      role: ROLE_ALIASES[user.role] || user.role,
    };
  },

  async updateProfile(userId, updates) {
    // Prevent changing password or id through profile update
    const { password, id, role, email, ...safeUpdates } = updates;
    const updated = await db.updateById('users', userId, safeUpdates);
    if (!updated) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = updated;
    return {
      ...userWithoutPassword,
      role: ROLE_ALIASES[updated.role] || updated.role,
    };
  },
};
