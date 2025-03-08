import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
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
            Robotics Education & Learning Kits
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Empowering the next generation of innovators with hands-on robotics education, 
            comprehensive learning kits, and electronic components.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button className="text-lg px-8 py-3">
                Explore Courses
              </Button>
            </Link>
            <Link to="/learning-kits">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Browse Learning Kits
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Courses */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <Link to="/courses" className="text-accent-pink hover:text-accent-red transition-colors">
              View All Courses →
            </Link>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Course 1 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">The Adventure of Arduino</h3>
                <p className="text-gray-300 mb-4">
                  Learn the fundamentals of Arduino programming and electronics in this beginner-friendly course.
                </p>
                <Link to="/courses/arduino-adventure" className="text-accent-pink hover:text-accent-red transition-colors">
                  Learn More →
                </Link>
              </Card>
            </motion.div>

            {/* Course 2 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fun with IoT</h3>
                <p className="text-gray-300 mb-4">
                  Explore the Internet of Things and build connected devices that interact with the world.
                </p>
                <Link to="/courses/fun-with-iot" className="text-accent-pink hover:text-accent-red transition-colors">
                  Learn More →
                </Link>
              </Card>
            </motion.div>

            {/* Course 3 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🔧</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Project Pathshala</h3>
                <p className="text-gray-300 mb-4">
                  Advanced project-based learning for students ready to build complex robotics systems.
                </p>
                <Link to="/courses/project-pathshala" className="text-accent-pink hover:text-accent-red transition-colors">
                  Learn More →
                </Link>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Learning Kits */}
      <section className="py-10 glass-effect">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
              Learning Kits
            </h2>
            <Link to="/learning-kits" className="text-accent-pink hover:text-accent-red transition-colors">
              View All Kits →
            </Link>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Kit 1 */}
            <motion.div variants={fadeIn}>
              <Card className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-square bg-primary-light rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🔌</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Starter Electronics Kit</h3>
                  <p className="text-gray-300 mb-4">
                    Everything you need to begin your electronics journey, including components, breadboard, and detailed guides.
                  </p>
                  <Link to="/learning-kits/starter-kit" className="text-accent-pink hover:text-accent-red transition-colors">
                    View Details →
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Kit 2 */}
            <motion.div variants={fadeIn}>
              <Card className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-square bg-primary-light rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Advanced Robotics Kit</h3>
                  <p className="text-gray-300 mb-4">
                    Build complex robots with motors, sensors, and programmable controllers for advanced projects.
                  </p>
                  <Link to="/learning-kits/advanced-robotics" className="text-accent-pink hover:text-accent-red transition-colors">
                    View Details →
                  </Link>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <motion.div 
          className="max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
            Ready to Start Your Robotics Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have transformed their understanding of electronics and robotics with our courses and kits.
          </p>
          <Link to="/courses">
            <Button className="text-lg px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage; 