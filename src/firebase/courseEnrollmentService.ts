import { database } from './config';
import { ref, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';

export interface CourseProgress {
  moduleId: string;
  moduleName: string;
  completed: boolean;
  completedLessons: string[];
  totalLessons: number;
}

export interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  enrolledDate: string;
  lastAccessedDate?: string;
  progress: number;
  imageUrl?: string;
  modules?: CourseProgress[];
  nextLesson?: {
    moduleId: string;
    lessonId: string;
    lessonName: string;
  };
  certificate?: {
    issued: boolean;
    issueDate?: string;
    certificateUrl?: string;
  };
}

const ENROLLMENTS_REF = 'courseEnrollments';

// Enroll a user in a course
export const enrollUserInCourse = async (
  userId: string, 
  courseId: string, 
  courseName: string,
  imageUrl?: string
): Promise<string> => {
  try {
    // Generate a unique enrollment ID
    const enrollmentId = `ENR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const enrollmentRef = ref(database, `${ENROLLMENTS_REF}/${enrollmentId}`);
    
    const enrollment: EnrolledCourse = {
      id: enrollmentId,
      userId,
      courseId,
      courseName,
      imageUrl,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      certificate: {
        issued: false
      }
    };
    
    await set(enrollmentRef, enrollment);
    return enrollmentId;
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
};

// Get all courses a user is enrolled in
export const getUserEnrolledCourses = async (userId: string): Promise<EnrolledCourse[]> => {
  try {
    const enrollmentsRef = ref(database, ENROLLMENTS_REF);
    const userEnrollmentsQuery = query(enrollmentsRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userEnrollmentsQuery);
    
    if (snapshot.exists()) {
      const enrollments: EnrolledCourse[] = [];
      snapshot.forEach((childSnapshot) => {
        enrollments.push(childSnapshot.val() as EnrolledCourse);
      });
      
      // Sort by enrolled date, newest first
      return enrollments.sort((a, b) => 
        new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime()
      );
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user enrolled courses:', error);
    throw error;
  }
};

// Get a specific enrollment
export const getEnrollment = async (enrollmentId: string): Promise<EnrolledCourse | null> => {
  try {
    const snapshot = await get(ref(database, `${ENROLLMENTS_REF}/${enrollmentId}`));
    
    if (snapshot.exists()) {
      return snapshot.val() as EnrolledCourse;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting enrollment:', error);
    throw error;
  }
};

// Check if a user is enrolled in a specific course
export const isUserEnrolledInCourse = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const enrollmentsRef = ref(database, ENROLLMENTS_REF);
    const userEnrollmentsQuery = query(enrollmentsRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userEnrollmentsQuery);
    
    if (snapshot.exists()) {
      let isEnrolled = false;
      snapshot.forEach((childSnapshot) => {
        const enrollment = childSnapshot.val() as EnrolledCourse;
        if (enrollment.courseId === courseId) {
          isEnrolled = true;
        }
      });
      
      return isEnrolled;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if user is enrolled:', error);
    throw error;
  }
};

// Update course progress
export const updateCourseProgress = async (
  enrollmentId: string, 
  progress: number,
  nextLesson?: EnrolledCourse['nextLesson']
): Promise<void> => {
  try {
    const updates: Partial<EnrolledCourse> = {
      progress,
      lastAccessedDate: new Date().toISOString()
    };
    
    if (nextLesson) {
      updates.nextLesson = nextLesson;
    }
    
    await update(ref(database, `${ENROLLMENTS_REF}/${enrollmentId}`), updates);
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

// Mark a module as completed
export const markModuleCompleted = async (
  enrollmentId: string,
  moduleId: string,
  completed: boolean = true
): Promise<void> => {
  try {
    // First, get the current enrollment
    const enrollment = await getEnrollment(enrollmentId);
    
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    // Update the module status
    let modules = enrollment.modules || [];
    const moduleIndex = modules.findIndex(m => m.moduleId === moduleId);
    
    if (moduleIndex >= 0) {
      modules[moduleIndex].completed = completed;
    }
    
    // Calculate overall progress
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.completed).length;
    const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Update enrollment
    await update(ref(database, `${ENROLLMENTS_REF}/${enrollmentId}`), {
      modules,
      progress,
      lastAccessedDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marking module as completed:', error);
    throw error;
  }
};

// Issue a certificate for a completed course
export const issueCertificate = async (enrollmentId: string, certificateUrl: string): Promise<void> => {
  try {
    await update(ref(database, `${ENROLLMENTS_REF}/${enrollmentId}`), {
      certificate: {
        issued: true,
        issueDate: new Date().toISOString(),
        certificateUrl
      }
    });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw error;
  }
};

export default {
  enrollUserInCourse,
  getUserEnrolledCourses,
  getEnrollment,
  isUserEnrolledInCourse,
  updateCourseProgress,
  markModuleCompleted,
  issueCertificate
}; 