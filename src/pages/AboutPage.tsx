import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
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

  // Mock student projects data
  const studentProjects = [
    {
      id: 1,
      title: 'Smart Home Automation',
      student: 'Rahul Sharma',
      description: 'A complete home automation system using Arduino and IoT technologies.',
      image: '🏠'
    },
    {
      id: 2,
      title: 'Autonomous Robot',
      student: 'Priya Patel',
      description: 'A self-navigating robot that can map and navigate through complex environments.',
      image: '🤖'
    },
    {
      id: 3,
      title: 'Weather Monitoring Station',
      student: 'Arjun Singh',
      description: 'An IoT-based weather station that collects and analyzes environmental data.',
      image: '☁️'
    }
  ];

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
            About The Makers Lab
          </h1>
          <p className="text-xl text-gray-300">
            Empowering the next generation of innovators through hands-on robotics education.
          </p>
        </motion.div>
      </section>

      {/* Our Mission */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-gray-300 mb-4">
                At The Makers Lab, we believe that every student deserves access to high-quality robotics education. Our mission is to inspire and empower the next generation of innovators, engineers, and problem-solvers through hands-on learning experiences.
              </p>
              <p className="text-gray-300 mb-4">
                We are committed to making robotics education accessible, engaging, and fun for students of all ages and backgrounds. Through our comprehensive courses, learning kits, and electronic components, we provide the tools and knowledge needed to turn creative ideas into reality.
              </p>
              <p className="text-gray-300">
                Our approach combines theoretical knowledge with practical application, ensuring that students not only understand the concepts but also gain the confidence to apply them in real-world scenarios.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="glass-effect p-8 rounded-xl">
              <div className="aspect-video bg-primary-light rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                  <span className="text-6xl">🚀</span>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">
                "Education is not the filling of a pail, but the lighting of a fire. At The Makers Lab, we ignite the passion for learning through hands-on robotics education."
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Student Projects */}
      <section className="py-10 glass-effect">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
            Student Projects
          </h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {studentProjects.map((project) => (
              <motion.div key={project.id} variants={fadeIn}>
                <Card className="h-full">
                  <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                      <span className="text-4xl">{project.image}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                  <p className="text-accent-pink mb-3">By {project.student}</p>
                  <p className="text-gray-300">
                    {project.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <p className="text-gray-300">
              These are just a few examples of the amazing projects our students have built. 
              Join us to start creating your own innovative solutions!
            </p>
          </div>
        </div>
      </section>

      {/* Founder Information */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row gap-12 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} className="md:w-1/3">
              <div className="aspect-square bg-primary-light rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                  <span className="text-6xl">👨‍🔬</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
                Meet Our Founder
              </h2>
              <h3 className="text-2xl font-semibold mb-4">Nikesh Bawankar</h3>
              <p className="text-gray-300 mb-4">
                With over a decade of experience in robotics and electronics education, Nikesh founded The Makers Lab with a vision to make technology education accessible to all students.
              </p>
              <p className="text-gray-300 mb-4">
                Having worked with educational institutions across India, Nikesh identified a gap in practical, hands-on learning opportunities in robotics. This led to the development of our comprehensive curriculum and specialized learning kits that have helped thousands of students discover their passion for technology.
              </p>
              <p className="text-gray-300">
                Nikesh holds a Master's degree in Electronics Engineering and is committed to continuously improving our educational offerings to stay at the forefront of technological advancements.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 