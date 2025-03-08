import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../firebase/productService';

const ComponentsPage: React.FC = () => {
  const { componentProducts, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([
    { id: 'all', name: 'All Components' }
  ]);
  const [allComponents, setAllComponents] = useState<Product[]>([]);

  // Define hardcoded components
  const hardcodedComponents: Product[] = [
    {
      id: 'arduino-uno',
      name: 'Arduino UNO',
      description: 'The Arduino UNO is the most popular Arduino board, perfect for beginners and experienced users alike.',
      price: '650',
      category: 'microcontrollers',
      stock: 15,
      imageUrl: '',
      productType: 'component'
    },
    {
      id: 'raspberry-pi',
      name: 'Raspberry Pi 4',
      description: 'The Raspberry Pi 4 is a powerful single-board computer that can run a full desktop operating system.',
      price: '3500',
      category: 'single_board_computers',
      stock: 8,
      imageUrl: '',
      productType: 'component'
    },
    {
      id: 'ultrasonic-sensor',
      name: 'Ultrasonic Distance Sensor',
      description: 'HC-SR04 ultrasonic sensor for distance measurement in robotics and automation projects.',
      price: '120',
      category: 'sensors',
      stock: 30,
      imageUrl: '',
      productType: 'component'
    },
    {
      id: 'servo-motor',
      name: 'Servo Motor SG90',
      description: 'Small servo motor ideal for controlling movement in robotics projects.',
      price: '180',
      category: 'actuators',
      stock: 25,
      imageUrl: '',
      productType: 'component'
    }
  ];

  // Combine hardcoded components with components from Firebase
  useEffect(() => {
    // Combine hardcoded components with components from Firebase
    // We use a Map to ensure we don't have duplicates by ID
    const combinedComponentsMap = new Map<string, Product>();
    
    // Add hardcoded components first
    hardcodedComponents.forEach(component => {
      combinedComponentsMap.set(component.id, component);
    });
    
    // Add Firebase components, potentially overriding hardcoded ones with the same ID
    if (componentProducts && componentProducts.length > 0) {
      componentProducts.forEach(component => {
        combinedComponentsMap.set(component.id, component);
      });
    }
    
    // Convert Map to array for state
    setAllComponents(Array.from(combinedComponentsMap.values()));
  }, [componentProducts]);

  // Extract available categories from all components
  useEffect(() => {
    if (allComponents.length > 0) {
      const uniqueCategories = new Set<string>();
      allComponents.forEach(component => {
        if (component.category) {
          uniqueCategories.add(component.category);
        }
      });
      
      const categoryItems = [
        { id: 'all', name: 'All Components' },
        ...Array.from(uniqueCategories).map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ') // Format category name
        }))
      ];
      
      setCategories(categoryItems);
    }
  }, [allComponents]);

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
        staggerChildren: 0.1
      }
    }
  };

  const filteredComponents = allComponents
    .filter(component => 
      (selectedCategory === 'all' || component.category === selectedCategory) &&
      (component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       component.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="space-y-16">
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
            Electronic Components
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            High-quality electronic components for all your robotics and DIY projects.
            From sensors to microcontrollers, we have everything you need.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <TextField
                  label="Search Components"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-2/3">
                <label className="block text-gray-200 mb-2 text-sm font-medium">
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-accent-pink to-accent-red text-white'
                          : 'bg-primary-light text-gray-300 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <h3 className="text-xl">Loading components...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              <h3 className="text-xl">{error}</h3>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-300">No components found matching your criteria.</h3>
              <p className="mt-2 text-gray-400">Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredComponents.map(component => (
                <motion.div key={component.id} variants={fadeIn}>
                  <ProductCard product={component} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Pre-made Projects Section */}
      <section className="py-16 glass-effect">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
              Pre-made Electronic Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't want to start from scratch? Check out our pre-assembled electronic projects, 
              ready to use right out of the box!
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Project 1 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Home Starter Kit</h3>
                <p className="text-gray-300 mb-4">
                  Pre-assembled smart home system with temperature, humidity, and motion sensors. 
                  Control lights and appliances remotely.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">₹3,499</span>
                  <Button>View Details</Button>
                </div>
              </Card>
            </motion.div>

            {/* Project 2 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Line Following Robot</h3>
                <p className="text-gray-300 mb-4">
                  Ready-to-use line following robot with IR sensors and programmable controller. 
                  Perfect for learning robotics fundamentals.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">₹2,999</span>
                  <Button>View Details</Button>
                </div>
              </Card>
            </motion.div>

            {/* Project 3 */}
            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <div className="aspect-video bg-primary-light rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-pink/30 to-accent-red/30 flex items-center justify-center">
                    <span className="text-4xl">🌡️</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Weather Station</h3>
                <p className="text-gray-300 mb-4">
                  Complete weather monitoring station with temperature, humidity, pressure, and 
                  rainfall sensors. Includes display and data logging.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">₹4,499</span>
                  <Button>View Details</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComponentsPage; 