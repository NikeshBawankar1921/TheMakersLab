import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../firebase/productService';

const CoursesPage: React.FC = () => {
  const { courseProducts, loading, error } = useProducts();
  const [visibleCourses, setVisibleCourses] = useState<Product[]>([]);

  // Define hardcoded courses
  const hardcodedCourses: Product[] = [
    {
      id: 'arduino-adventure',
      name: 'The Adventure of Arduino',
      description: 'This comprehensive course introduces you to the world of Arduino programming and electronics. Starting from the basics, you\'ll learn how to set up your Arduino, understand electronic components, and write your first programs. By the end of the course, you\'ll be able to build your own interactive electronic projects.',
      price: '4999',
      category: 'arduino',
      stock: 100,
      imageUrl: '',
      productType: 'course'
    },
    {
      id: 'fun-with-iot',
      name: 'Fun with IoT',
      description: 'Dive into the exciting world of IoT (Internet of Things) and learn how to create connected devices that can communicate with each other and the internet. This course covers everything from basic networking concepts to cloud integration, enabling you to build sophisticated IoT projects.',
      price: '6999',
      category: 'iot',
      stock: 100,
      imageUrl: '',
      productType: 'course'
    },
    {
      id: 'project-pathshala',
      name: 'Project Pathshala',
      description: 'Project Pathshala is our advanced course designed for students who have mastered the basics and are ready to take on complex robotics challenges. Through a series of increasingly sophisticated projects, you\'ll develop problem-solving skills and gain hands-on experience with advanced robotics concepts.',
      price: '8999',
      category: 'robotics',
      stock: 100,
      imageUrl: '',
      productType: 'course'
    }
  ];

  // Initialize courses when data loads
  useEffect(() => {
    // Combine hardcoded courses with courses from Firebase
    // We use a Map to ensure we don't have duplicates by ID
    const combinedCoursesMap = new Map<string, Product>();
    
    // Add hardcoded courses first
    hardcodedCourses.forEach(course => {
      combinedCoursesMap.set(course.id, course);
    });
    
    // Add Firebase courses, potentially overriding hardcoded ones with the same ID
    if (courseProducts && courseProducts.length > 0) {
      courseProducts.forEach(course => {
        combinedCoursesMap.set(course.id, course);
      });
    }
    
    // Convert Map to array for state
    setVisibleCourses(Array.from(combinedCoursesMap.values()));
  }, [courseProducts]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Format course level based on category
  const getCourseLevel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'arduino': 'Beginner',
      'iot': 'Intermediate',
      'robotics': 'Advanced',
      'programming': 'Intermediate'
    };
    
    return categoryMap[category] || 'All Levels';
  };

  // Generate course duration based on price (for demo purposes)
  const getCourseDuration = (price: string): string => {
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
    
    if (priceNum < 2000) return '4 weeks';
    if (priceNum < 5000) return '8 weeks';
    if (priceNum < 8000) return '10 weeks';
    return '12 weeks';
  };

  // Generate course topics based on description
  const getCourseTopics = (description: string): string[] => {
    // Generate topics from description or return default topics
    const keywords = ['Arduino', 'Electronics', 'IoT', 'Programming', 'Robotics', 'Sensors', 'Projects'];
    const topics: string[] = [];
    
    // Extract 4-5 topics from description or use defaults
    keywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword.toLowerCase()) && topics.length < 5) {
        topics.push(`${keyword} fundamentals and applications`);
      }
    });
    
    // Add defaults if needed
    if (topics.length < 4) {
      topics.push(
        'Hands-on project development',
        'Troubleshooting and debugging skills',
        'Building interactive systems',
        'Advanced concepts and techniques'
      );
    }
    
    return topics.slice(0, 5);
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary-light opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-accent-pink to-accent-red opacity-10 z-0"></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
            Our Courses
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive robotics education for all skill levels. From beginners to advanced learners, 
            we have the perfect course to help you achieve your goals.
          </p>
        </motion.div>
      </section>

      {/* Courses List */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <h3 className="text-xl">Loading courses...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              <h3 className="text-xl">{error}</h3>
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-300">No courses available at the moment.</h3>
              <p className="mt-2 text-gray-400">Please check back later for new course offerings.</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {visibleCourses.map((course, index) => (
                <motion.div 
                  key={course.id}
                  variants={fadeIn}
                  className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 glass-effect p-8 rounded-xl`}
                >
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-primary-light rounded-lg overflow-hidden">
                      {course.imageUrl ? (
                        <img 
                          src={course.imageUrl} 
                          alt={course.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            // Add a gradient background with emoji if image fails to load
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                                <span class="text-6xl">📚</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                          <span className="text-6xl">📚</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-primary-light text-accent-pink">
                        {getCourseLevel(course.category)}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-primary-light text-accent-pink">
                        {getCourseDuration(course.price)}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{course.name}</h2>
                    <p className="text-gray-300 mb-6">
                      {course.description}
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">What You'll Learn:</h3>
                      <ul className="space-y-2">
                        {getCourseTopics(course.description).map((topic, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-accent-pink mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-2xl font-bold text-white">
                        ₹{course.price}
                      </div>
                      <Link to={`/courses/${course.id}`}>
                        <Button className="px-6 py-2">
                          Enroll Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center glass-effect">
        <motion.div 
          className="max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
            Not Sure Which Course Is Right For You?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact our education advisors for personalized guidance on selecting the perfect course for your skill level and interests.
          </p>
          <Button className="text-lg px-8 py-3">
            Get Free Consultation
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default CoursesPage; 