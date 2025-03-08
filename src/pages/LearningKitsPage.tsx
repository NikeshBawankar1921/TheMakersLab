import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../firebase/productService';

const LearningKitsPage: React.FC = () => {
  const { projectProducts, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([
    { id: 'all', name: 'All Kits' }
  ]);
  const [allKits, setAllKits] = useState<Product[]>([]);

  // Define hardcoded learning kits
  const hardcodedKits: Product[] = [
    {
      id: 'arduino-starter-kit',
      name: 'Arduino Starter Kit',
      description: 'Complete Arduino starter kit with all components needed for beginners to start learning electronics and programming.',
      price: '1999',
      category: 'arduino',
      stock: 10,
      imageUrl: '',
      productType: 'project'
    },
    {
      id: 'robotics-arm-kit',
      name: 'Robotics Arm Kit',
      description: 'Build your own robotic arm with this comprehensive kit. Learn about servo motors, mechanics, and control.',
      price: '3499',
      category: 'robotics',
      stock: 5,
      imageUrl: '',
      productType: 'project'
    },
    {
      id: 'iot-home-automation',
      name: 'IoT Home Automation Kit',
      description: 'Create your own smart home devices with this IoT starter kit. Includes WiFi module, sensors, and relays.',
      price: '2499',
      category: 'iot',
      stock: 8,
      imageUrl: '',
      productType: 'project'
    },
    {
      id: 'weather-station-kit',
      name: 'Weather Station Kit',
      description: 'Build a fully functional weather station that measures temperature, humidity, pressure, and more.',
      price: '1799',
      category: 'environmental',
      stock: 12,
      imageUrl: '',
      productType: 'project'
    }
  ];

  // Combine hardcoded kits with projects from Firebase
  useEffect(() => {
    // Combine hardcoded kits with projects from Firebase
    // We use a Map to ensure we don't have duplicates by ID
    const combinedKitsMap = new Map<string, Product>();
    
    // Add hardcoded kits first
    hardcodedKits.forEach(kit => {
      combinedKitsMap.set(kit.id, kit);
    });
    
    // Add Firebase projects, potentially overriding hardcoded ones with the same ID
    if (projectProducts && projectProducts.length > 0) {
      projectProducts.forEach(project => {
        combinedKitsMap.set(project.id, project);
      });
    }
    
    // Convert Map to array for state
    setAllKits(Array.from(combinedKitsMap.values()));
  }, [projectProducts]);

  // Extract available categories from all kits
  useEffect(() => {
    if (allKits.length > 0) {
      const uniqueCategories = new Set<string>();
      allKits.forEach(kit => {
        if (kit.category) {
          uniqueCategories.add(kit.category);
        }
      });
      
      const categoryItems = [
        { id: 'all', name: 'All Kits' },
        ...Array.from(uniqueCategories).map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ') // Format category name
        }))
      ];
      
      setCategories(categoryItems);
    }
  }, [allKits]);

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

  const filteredKits = selectedCategory === 'all' 
    ? allKits 
    : allKits.filter(kit => kit.category === selectedCategory);

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
            Learning Kits
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive kits with all the components you need to build exciting robotics projects.
            Perfect for hands-on learning at any skill level.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
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
      </section>

      {/* Learning Kits Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <h3 className="text-xl">Loading learning kits...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              <h3 className="text-xl">{error}</h3>
            </div>
          ) : filteredKits.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-300">No learning kits found matching your criteria.</h3>
              <p className="mt-2 text-gray-400">Try selecting a different category or check back later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredKits.map(kit => (
                <motion.div key={kit.id} variants={fadeIn}>
                  <ProductCard product={kit} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 glass-effect">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
              Custom Learning Kits
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Need a specialized kit for your classroom or specific project? We offer custom learning kits 
              tailored to your educational requirements.
            </p>
            <Button className="text-lg px-8 py-3">
              Request Custom Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningKitsPage; 