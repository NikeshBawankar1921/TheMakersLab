import { database } from './config';
import { ref, get, set, update, remove } from 'firebase/database';

// Define types for admin data
export interface AdminSettings {
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  featuredProducts?: string[];
  bannerMessage?: string;
  isMaintenanceMode?: boolean;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Path to admin data in Firebase
const ADMIN_REF = 'admin';

/**
 * Fetch admin settings from Firebase
 */
export const getAdminSettings = async (): Promise<AdminSettings | null> => {
  try {
    console.log("Fetching admin settings from Firebase...");
    const snapshot = await get(ref(database, ADMIN_REF));
    
    if (snapshot.exists()) {
      const adminData = snapshot.val();
      console.log("Admin settings fetched successfully:", adminData);
      return adminData;
    } else {
      console.log("No admin settings found in database");
      return null;
    }
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    throw error;
  }
};

/**
 * Update admin settings in Firebase
 */
export const updateAdminSettings = async (settings: Partial<AdminSettings>): Promise<void> => {
  try {
    console.log("Updating admin settings:", settings);
    await update(ref(database, ADMIN_REF), settings);
    console.log("Admin settings updated successfully");
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw error;
  }
};

/**
 * Initialize default admin settings if none exist
 */
export const initializeDefaultAdminSettings = async (): Promise<void> => {
  try {
    const snapshot = await get(ref(database, ADMIN_REF));
    
    if (!snapshot.exists()) {
      console.log("No admin settings found, initializing defaults...");
      const defaultSettings: AdminSettings = {
        siteTitle: "The Makers Lab",
        siteDescription: "Robotics Education & Learning Kits Platform",
        contactEmail: "admin@themakerslab.com",
        isMaintenanceMode: false,
        theme: {
          primaryColor: "#121212",
          secondaryColor: "#1e1e1e", 
          accentColor: "#ff4081"
        },
        socialLinks: {
          facebook: "https://facebook.com/themakerslab",
          instagram: "https://instagram.com/themakerslab",
          twitter: "https://twitter.com/themakerslab",
          youtube: "https://youtube.com/themakerslab"
        }
      };
      
      await set(ref(database, ADMIN_REF), defaultSettings);
      console.log("Default admin settings initialized");
    }
  } catch (error) {
    console.error("Error initializing default admin settings:", error);
    throw error;
  }
};

export default {
  getAdminSettings,
  updateAdminSettings,
  initializeDefaultAdminSettings
}; 