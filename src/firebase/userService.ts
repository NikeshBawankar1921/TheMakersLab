import { database } from './config';
import { ref, set, get, update, remove } from 'firebase/database';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orderHistory?: string[]; // IDs of orders
  createdAt: number;
  updatedAt: number;
}

// Simplified path directly to users collection
const USERS_REF = 'users';

// Create or update user profile
export const saveUserProfile = async (user: FirebaseUser, additionalData?: Partial<UserProfile>): Promise<void> => {
  try {
    console.log("Saving user profile to path:", `${USERS_REF}/${user.uid}`);
    const userRef = ref(database, `${USERS_REF}/${user.uid}`);
    const snapshot = await get(userRef);
    
    const now = Date.now();
    
    if (!snapshot.exists()) {
      // Create new user profile
      const userData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData?.displayName || '',
        photoURL: user.photoURL || additionalData?.photoURL || '',
        phoneNumber: user.phoneNumber || additionalData?.phoneNumber || '',
        address: additionalData?.address || {},
        createdAt: now,
        updatedAt: now
      };
      
      console.log("Creating new user profile:", { ...userData, email: userData.email ? '***@***' : '' });
      await set(userRef, userData);
      console.log("User profile created successfully");
    } else {
      // Update existing user profile
      const updates: Partial<UserProfile> = {
        ...additionalData,
        email: user.email || snapshot.val().email,
        displayName: user.displayName || additionalData?.displayName || snapshot.val().displayName,
        photoURL: user.photoURL || additionalData?.photoURL || snapshot.val().photoURL,
        phoneNumber: user.phoneNumber || additionalData?.phoneNumber || snapshot.val().phoneNumber,
        updatedAt: now
      };
      
      console.log("Updating existing user profile:", user.uid);
      await update(userRef, updates);
      console.log("User profile updated successfully");
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const snapshot = await get(ref(database, `${USERS_REF}/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    updates.updatedAt = Date.now();
    await update(ref(database, `${USERS_REF}/${userId}`), updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Add order to user's order history
export const addOrderToHistory = async (userId: string, orderId: string): Promise<void> => {
  try {
    const userRef = ref(database, `${USERS_REF}/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val() as UserProfile;
      const orderHistory = userData.orderHistory || [];
      orderHistory.push(orderId);
      
      await update(userRef, { 
        orderHistory,
        updatedAt: Date.now()
      });
    }
  } catch (error) {
    console.error('Error adding order to history:', error);
    throw error;
  }
};

// Delete user profile
export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    await remove(ref(database, `${USERS_REF}/${userId}`));
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};

export default {
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
  addOrderToHistory,
  deleteUserProfile
}; 