// API Service for FightNight App
// Using DummyJSON for reliable MMA & Boxing fight data

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

/**
 * Authenticate user with dummyjson API
 * @param {string} username - Username (use 'emilys' for testing)
 * @param {string} password - Password (use 'emilyspass' for testing)
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const data = await response.json();
    console.log('✅ Login successful:', data.username);
    return data; // Returns { id, username, email, firstName, lastName, gender, image, token }
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * Transform dummyjson products into fight cards
 * Mapping:
 * - title → Fighter names (we'll create fake matchups)
 * - description → Event venue/details
 * - thumbnail → Fight poster image
 * - price → Ticket price
 */
const transformProductsToFights = (products) => {
  // Fight sport types for variety
  const fightTypes = ['MMA', 'Boxing', 'MMA', 'Boxing', 'MMA'];
  
  // Common fighter name patterns to create realistic matchups
  const fighters = [
    'Jones', 'Silva', 'McGregor', 'Nurmagomedov', 'Adesanya',
    'Usman', 'Miocic', 'Ngannou', 'Holloway', 'Volkanovski',
    'Canelo', 'Crawford', 'Usyk', 'Fury', 'Joshua',
    'Garcia', 'Davis', 'Spence', 'Inoue', 'Bivol'
  ];
  
  // MMA/Boxing themed placeholder images (Unsplash)
  const fightImages = [
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop', // MMA gloves
    'https://images.unsplash.com/photo-1517438322307-e67111335449?w=400&h=300&fit=crop', // Boxing ring
    'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400&h=300&fit=crop', // Boxing match
    'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=400&h=300&fit=crop', // Boxing gloves
    'https://images.unsplash.com/photo-1544117519-31a4a39f4f50?w=400&h=300&fit=crop', // Fighter training
    'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=400&h=300&fit=crop', // Boxing gym
    'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=400&h=300&fit=crop', // MMA cage
    'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=300&fit=crop', // Boxing punch
  ];
  
  // Generate upcoming dates (next 60 days)
  const generateFutureDate = (index) => {
    const date = new Date();
    date.setDate(date.getDate() + (index * 2) + 1); // Spread fights over 60 days
    return date.toISOString().split('T')[0];
  };
  
  return products.map((product, index) => {
    const sportType = fightTypes[index % fightTypes.length];
    const fighter1 = fighters[index % fighters.length];
    const fighter2 = fighters[(index + 7) % fighters.length];
    const fightDate = generateFutureDate(index);
    
    // Use fight-themed image instead of product image
    const fightImage = fightImages[index % fightImages.length];
    
    // Create realistic fight venues from product descriptions
    const venues = [
      'MGM Grand, Las Vegas',
      'Madison Square Garden, New York',
      'T-Mobile Arena, Las Vegas',
      'O2 Arena, London',
      'Staples Center, Los Angeles',
      'Toyota Center, Houston',
      'TD Garden, Boston',
      'Barclays Center, Brooklyn'
    ];
    const venue = venues[index % venues.length];
    
    return {
      // Basic Info
      id: product.id.toString(),
      title: `${fighter1} vs ${fighter2}`,
      headline: `${sportType} Championship`,
      
      // Fighters
      fighter1: fighter1,
      fighter2: fighter2,
      
      // Event Details
      date: fightDate,
      time: '21:00', // 9 PM standard fight time
      sport: sportType,
      league: sportType === 'MMA' ? 'UFC' : 'Boxing',
      
      // Location
      venue: venue,
      location: venue,
      
      // Images - Use fight-themed images instead of product images
      thumbnail: fightImage,
      poster: fightImage,
      image: fightImage,
      
      // Additional Info
      description: `${sportType} Championship bout featuring ${fighter1} vs ${fighter2} at ${venue}`,
      ticketPrice: product.price || 49.99,
      status: 'Upcoming',
      
      // Original product data (for reference)
      _originalProduct: {
        title: product.title,
        category: product.category,
        brand: product.brand
      }
    };
  });
};

/**
 * Fetch all products and transform them into fight cards
 */
export const fetchAllFights = async () => {
  try {
    const response = await fetch(`${DUMMYJSON_BASE_URL}/products?limit=30`);
    const data = await response.json();
    
    if (!data.products || data.products.length === 0) {
      console.log('⚠️ No products returned from API');
      return [];
    }
    
    console.log(`✅ Fetched ${data.products.length} products (transformed to fights)`);
    
    // Transform products into fight cards
    const fights = transformProductsToFights(data.products);
    
    // Sort by date (upcoming fights first)
    return fights.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('❌ Error fetching fights:', error);
    return [];
  }
};

/**
 * Search for fights by fighter name or event title
 */
export const searchFights = async (searchTerm) => {
  try {
    console.log('🔍 Searching fights for:', searchTerm);
    // Fetch all fights and filter locally
    const allFights = await fetchAllFights();
    console.log('🔍 Total fights to search:', allFights.length);
    
    if (!searchTerm || searchTerm.trim() === '') {
      console.log('🔍 No search term, returning all fights');
      return allFights;
    }
    
    const term = searchTerm.toLowerCase();
    const results = allFights.filter(fight => 
      fight.title.toLowerCase().includes(term) ||
      fight.fighter1.toLowerCase().includes(term) ||
      fight.fighter2.toLowerCase().includes(term) ||
      fight.sport.toLowerCase().includes(term) ||
      fight.venue.toLowerCase().includes(term)
    );
    console.log('🔍 Search results found:', results.length);
    return results;
  } catch (error) {
    console.error('❌ Error searching fights:', error);
    return [];
  }
};

/**
 * Get fight details by ID
 */
export const getFightById = async (fightId) => {
  try {
    const allFights = await fetchAllFights();
    return allFights.find(fight => fight.id === fightId.toString());
  } catch (error) {
    console.error('❌ Error fetching fight details:', error);
    return null;
  }
};

/**
 * Search for fighters
 */
export const searchFighters = async (searchTerm) => {
  try {
    // For fighter search, we'll return unique fighters from our fights
    const allFights = await fetchAllFights();
    const fightersSet = new Set();
    
    allFights.forEach(fight => {
      fightersSet.add(fight.fighter1);
      fightersSet.add(fight.fighter2);
    });
    
    console.log('🥊 Building fighters list from', fightersSet.size, 'unique fighters');
    
    // Fighter profile images - MMA/Boxing themed
    const fighterImages = [
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop', // MMA fighter
      'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=300&h=300&fit=crop', // Boxer
      'https://images.unsplash.com/photo-1567013275033-e0719cb29290?w=300&h=300&fit=crop', // Fighter portrait
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop', // Athletic man
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop', // Fighter training
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop', // Gym workout
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop', // Boxing gym
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=300&h=300&fit=crop', // Boxer portrait
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300&h=300&fit=crop', // Athletic build
      'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=300&h=300&fit=crop', // Fighter stance
    ];
    
    const fighters = Array.from(fightersSet).map((name, index) => ({
      id: index + 1,
      name: name,
      nickname: `The ${['Champ', 'Beast', 'Warrior', 'Legend', 'King'][index % 5]}`,
      nationality: ['USA', 'Brazil', 'Russia', 'UK', 'Ireland'][index % 5],
      wins: Math.floor(Math.random() * 30) + 10,
      losses: Math.floor(Math.random() * 5),
      division: ['Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight'][index % 4],
      weight: ['205 lbs', '185 lbs', '170 lbs', '155 lbs', '145 lbs'][index % 5],
      team: ['American Top Team', 'Jackson-Wink MMA', 'AKA', 'Tristar Gym', 'City Kickboxing'][index % 5],
      photo: fighterImages[index % fighterImages.length]
    }));
    
    console.log('🥊 Total fighters:', fighters.length);
    
    if (!searchTerm || searchTerm.trim() === '') {
      return fighters;
    }
    
    const term = searchTerm.toLowerCase();
    return fighters.filter(fighter => 
      fighter.name.toLowerCase().includes(term) ||
      fighter.nickname.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('❌ Error searching fighters:', error);
    return [];
  }
};

/**
 * Get past fight results (for "Past Results" search mode)
 */
export const searchPastEvents = async () => {
  try {
    console.log('🕐 Fetching past events...');
    const response = await fetch(`${DUMMYJSON_BASE_URL}/products?limit=15`);
    const data = await response.json();
    
    if (!data.products) {
      console.log('⚠️ No products for past events');
      return [];
    }
    
    // Fight-themed images for past events
    const fightImages = [
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517438322307-e67111335449?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544117519-31a4a39f4f50?w=400&h=300&fit=crop',
    ];
    
    // Transform to past fights with results
    const pastFights = data.products.map((product, index) => {
      const sportType = ['MMA', 'Boxing'][index % 2];
      const fighters = [
        'Jones', 'Silva', 'McGregor', 'Nurmagomedov', 'Adesanya',
        'Canelo', 'Crawford', 'Usyk', 'Fury', 'Joshua'
      ];
      
      const fighter1 = fighters[index % fighters.length];
      const fighter2 = fighters[(index + 5) % fighters.length];
      
      // Generate past dates (last 60 days)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - (index * 3) - 1);
      
      const winner = Math.random() > 0.5 ? fighter1 : fighter2;
      const methods = ['KO', 'TKO', 'Submission', 'Decision', 'Unanimous Decision'];
      const method = methods[index % methods.length];
      const round = Math.floor(Math.random() * 5) + 1;
      
      return {
        id: `past-${product.id}`,
        title: `${fighter1} vs ${fighter2}`,
        fighter1,
        fighter2,
        date: pastDate.toISOString().split('T')[0],
        sport: sportType,
        status: 'Completed',
        winner: winner,
        result: `${winner} def. ${winner === fighter1 ? fighter2 : fighter1}`,
        method: method,
        round: round,
        time: `${Math.floor(Math.random() * 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        thumbnail: fightImages[index % fightImages.length],
        venue: ['MGM Grand', 'Madison Square Garden', 'T-Mobile Arena', 'O2 Arena'][index % 4],
        location: ['Las Vegas', 'New York', 'Las Vegas', 'London'][index % 4]
      };
    });
    
    console.log('✅ Past events loaded:', pastFights.length);
    return pastFights.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('❌ Error fetching past events:', error);
    return [];
  }
};

// Export all functions
export default {
  loginUser,
  fetchAllFights,
  searchFights,
  getFightById,
  searchFighters,
  searchPastEvents
};
