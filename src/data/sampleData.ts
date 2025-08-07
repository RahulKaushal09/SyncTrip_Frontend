import { BlogPost, Location } from "@/types";
import blog1 from "@/assets/images/blog-1.jpg";
import blog2 from "@/assets/images/blog-2.jpg";
import blog3 from "@/assets/images/blog-3.jpg";

export const sampleLocations: Location[] = [
  {
    id: "loc_001",
    title: "Manali",
    description: "A picturesque hill station in Himachal Pradesh known for its stunning landscapes, adventure sports, and pleasant weather.",
    best_time: "April to June, September to November",
    rating: "4.8",
    PlaceImageLink: blog1.src,
    objective: "Mountain Adventure & Relaxation",
    state: "Himachal Pradesh",
    country: "India",
    placesNumberToVisit: "15",
    fullDetails: {
      full_description: "Manali is a high-altitude Himalayan resort town in India's northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.",
      additional_info: ["Adventure Sports Hub", "Honeymoon Destination", "Backpacker Paradise"],
      top_places_to_visit: [
        { name: "Rohtang Pass", link: "/places/rohtang-pass", image: blog1.src },
        { name: "Solang Valley", link: "/places/solang-valley", image: blog2.src },
        { name: "Hadimba Temple", link: "/places/hadimba-temple", image: blog3.src }
      ]
    },
    photos: [
      blog1.src,
      blog2.src,
      blog3.src
    ]
  },
  {
    id: "loc_002",
    title: "Havelock Island",
    description: "Part of the Andaman Islands, famous for its pristine beaches, crystal clear waters, and vibrant marine life.",
    best_time: "October to May",
    rating: "4.9",
    PlaceImageLink: blog2.src,
    objective: "Beach Paradise & Water Sports",
    state: "Andaman and Nicobar Islands",
    country: "India",
    placesNumberToVisit: "8",
    fullDetails: {
      full_description: "Havelock Island is the largest of the islands that comprise Ritchie's Archipelago, a chain of islands to the east of Great Andaman.",
      additional_info: ["Scuba Diving", "Snorkeling", "Beach Activities"],
      top_places_to_visit: [
        { name: "Radhanagar Beach", link: "/places/radhanagar-beach", image: blog2.src },
        { name: "Elephant Beach", link: "/places/elephant-beach", image: blog1.src },
        { name: "Kalapathar Beach", link: "/places/kalapathar-beach", image: blog3.src }
      ]
    },
    photos: [
      blog1.src,
      blog2.src,
      blog3.src
    ]
  },
  {
    id: "loc_003",
    title: "Khajuraho",
    description: "Famous for its stunning temples with intricate carvings, representing the pinnacle of Indian architectural achievement.",
    best_time: "October to March",
    rating: "4.7",
    PlaceImageLink: blog3.src,
    objective: "Cultural Heritage & Architecture",
    state: "Madhya Pradesh",
    country: "India",
    placesNumberToVisit: "12",
    fullDetails: {
      full_description: "Khajuraho is a town in the Indian state of Madhya Pradesh, located in Chhatarpur district. It is known for its temple complex.",
      additional_info: ["UNESCO World Heritage Site", "Ancient Architecture", "Cultural Tourism"],
      top_places_to_visit: [
        { name: "Western Group of Temples", link: "/places/western-temples", image: blog3.src },
        { name: "Eastern Group of Temples", link: "/places/eastern-temples", image: blog1.src },
        { name: "Southern Group of Temples", link: "/places/southern-temples", image: blog2.src }
      ]
    },
    photos: [
      blog1.src,
      blog2.src,
      blog3.src
    ]
  },
  {
    id: "loc_004",
    title: "Goa",
    description: "India's smallest state, famous for its beaches, Portuguese heritage, and vibrant nightlife.",
    best_time: "November to March",
    rating: "4.6",
    PlaceImageLink: blog1.src,
    objective: "Beach & Nightlife",
    state: "Goa",
    country: "India",
    placesNumberToVisit: "20",
    fullDetails: {
      full_description: "Goa is a state in western India with coastlines stretching along the Arabian Sea.",
      additional_info: ["Beach Paradise", "Portuguese Heritage", "Vibrant Nightlife"],
      top_places_to_visit: [
        { name: "Baga Beach", link: "/places/baga-beach", image: blog1.src },
        { name: "Old Goa Churches", link: "/places/old-goa", image: blog2.src },
        { name: "Dudhsagar Falls", link: "/places/dudhsagar-falls", image: blog3.src }
      ]
    },
    photos: [
      blog1.src,
      blog2.src,
      blog3.src
    ]
  }
];

export const sampleBlogs: BlogPost[] = [
  {
    id: "blog_001",
    slug: "hidden-gems-himalayas-journey",
    title: "Hidden Gems of the Himalayas: A Journey Through Unexplored Valleys",
    content: `
      <div class="blog-content">
        <h2>Discovering the Untouched Beauty of the Himalayas</h2>
        <p>The Himalayas have always been a source of fascination for travelers from around the world. While popular destinations like Manali and Shimla attract millions of visitors, there are hidden valleys and remote villages that remain largely unexplored.</p>
        
        <h3>The Journey Begins</h3>
        <p>Our adventure started from Delhi, taking the scenic route through winding mountain roads that offered breathtaking views at every turn. The air became crisp and clean as we ascended higher into the mountains.</p>
        
        <blockquote>
          <p>"The mountains are calling and I must go." - John Muir</p>
        </blockquote>
        
        <h3>Hidden Valleys Worth Exploring</h3>
        <ul>
          <li><strong>Tirthan Valley:</strong> A pristine valley known for its crystal-clear rivers and trout fishing</li>
          <li><strong>Sainj Valley:</strong> Perfect for nature lovers and wildlife enthusiasts</li>
          <li><strong>Jiwa Nal:</strong> A hidden gem with stunning meadows and panoramic views</li>
        </ul>
        
        <h3>Local Culture and Traditions</h3>
        <p>What makes these hidden valleys truly special is the warm hospitality of the local people. Their traditional way of life, unchanged for generations, offers visitors a glimpse into authentic Himalayan culture.</p>
        
        <h3>Best Time to Visit</h3>
        <p>The ideal time to explore these hidden gems is from April to June and September to November when the weather is pleasant and the roads are accessible.</p>
        
        <h3>Planning Your Trip</h3>
        <p>For those planning to explore these hidden valleys, it's essential to:</p>
        <ol>
          <li>Pack appropriate winter clothing</li>
          <li>Carry essential medications</li>
          <li>Book accommodations in advance</li>
          <li>Respect local customs and environment</li>
        </ol>
      </div>
    `,
    featuredImage: blog1.src,
    createdAt: "2024-12-15T10:00:00Z",
    relatedLocations: ["loc_001"],
    seo: {
      seo_title: "Hidden Gems of the Himalayas: A Journey Through Unexplored Valleys | SyncTrip",
      seo_description: "Discover the untouched beauty of remote Himalayan villages where ancient traditions meet breathtaking landscapes. Complete travel guide to hidden valleys.",
      seo_keywords: ["Himalayas", "hidden valleys", "mountain travel", "Tirthan Valley", "adventure travel"],
      canonical_url: "https://synctrip.in/blog/hidden-gems-himalayas-journey",
      seo_image: blog1.src
    },
    tags: ["Mountains", "Adventure", "Hidden Gems", "Himalayas"],
    author: "Priya Sharma",
    readTime: "8 min read",
    category: "Mountain",
    rating: "4.8",
    featured: true
  },
  {
    id: "blog_002",
    slug: "andaman-secret-beaches-guide",
    title: "Paradise Found: The Ultimate Guide to Andaman's Secret Beaches",
    content: `
      <div class="blog-content">
        <h2>Escape to Pristine Shores</h2>
        <p>The Andaman Islands are home to some of the world's most beautiful beaches, with crystal-clear waters and powder-soft sand. While Radhanagar Beach gets most of the attention, there are hidden gems waiting to be discovered.</p>
        
        <h3>Secret Beach #1: Long Island Beach</h3>
        <p>Accessible only by boat, Long Island Beach offers complete seclusion and pristine beauty. The journey itself is an adventure through mangrove channels.</p>
        
        <h3>Secret Beach #2: Guitar Island Beach</h3>
        <p>Named for its unique guitar-like shape when viewed from above, this uninhabited island offers the ultimate in privacy and natural beauty.</p>
        
        <h3>Marine Life and Snorkeling</h3>
        <p>The waters around these secret beaches teem with colorful marine life. Don't miss the opportunity to snorkel and witness the underwater paradise.</p>
        
        <h3>Conservation Efforts</h3>
        <p>These pristine beaches are protected by strict conservation laws. Visitors are expected to follow responsible tourism practices to preserve their natural beauty.</p>
        
        <h3>Getting There</h3>
        <p>Most secret beaches require boat transfers or guided tours. It's recommended to book through registered tour operators who prioritize environmental conservation.</p>
      </div>
    `,
    featuredImage: blog2.src,
    createdAt: "2024-12-12T10:00:00Z",
    relatedLocations: ["loc_002"],
    seo: {
      seo_title: "Ultimate Guide to Andaman's Secret Beaches | Hidden Paradise | SyncTrip",
      seo_description: "Discover hidden beaches in Andaman Islands with crystal-clear waters and pristine sand. Complete guide to secret beaches away from crowds.",
      seo_keywords: ["Andaman beaches", "secret beaches", "Havelock Island", "beach travel", "tropical paradise"],
      canonical_url: "https://synctrip.in/blog/andaman-secret-beaches-guide",
      seo_image: blog2.src
    },
    tags: ["Beaches", "Islands", "Secret Places", "Andaman"],
    author: "Rahul Menon",
    readTime: "6 min read",
    category: "Beach",
    rating: "4.9"
  },
  {
    id: "blog_003",
    slug: "ancient-temples-modern-adventures-india",
    title: "Ancient Temples and Modern Adventures in Incredible India",
    content: `
      <div class="blog-content">
        <h2>A Journey Through Time</h2>
        <p>India's ancient temples stand as magnificent testaments to the country's rich cultural heritage. These architectural marvels offer more than just spiritual experiences - they're gateways to understanding India's fascinating history.</p>
        
        <h3>Khajuraho: The Crown Jewel</h3>
        <p>The temples of Khajuraho represent the pinnacle of Indian temple architecture. Built between 950-1050 CE, these UNESCO World Heritage sites showcase intricate carvings that tell stories of life, love, and spirituality.</p>
        
        <h3>Temple Architecture Explained</h3>
        <p>The temples follow the traditional Indian architectural style with:</p>
        <ul>
          <li>Sanctum sanctorum (Garbhagriha)</li>
          <li>Assembly hall (Mandapa)</li>
          <li>Tower (Shikhara)</li>
          <li>Entrance porch (Ardhamandapa)</li>
        </ul>
        
        <h3>Modern Adventures Nearby</h3>
        <p>While exploring these ancient wonders, visitors can also enjoy modern adventure activities like:</p>
        <ul>
          <li>Hot air balloon rides over temple complexes</li>
          <li>Cycling tours through rural villages</li>
          <li>Photography workshops</li>
          <li>Cultural performances and festivals</li>
        </ul>
        
        <h3>Best Photography Tips</h3>
        <p>Golden hour photography at these temples creates magical images. Early morning and late afternoon light brings out the intricate details of the stone carvings.</p>
        
        <h3>Cultural Significance</h3>
        <p>These temples represent the artistic, cultural, and religious heritage of India. They showcase the advanced knowledge of architecture, astronomy, and mathematics of ancient Indian civilization.</p>
      </div>
    `,
    featuredImage: blog3.src,
    createdAt: "2024-12-10T10:00:00Z",
    relatedLocations: ["loc_003"],
    seo: {
      seo_title: "Ancient Temples and Modern Adventures in India | Cultural Travel Guide | SyncTrip",
      seo_description: "Explore magnificent temple complexes and modern adventures in India. Complete guide to cultural heritage sites and activities.",
      seo_keywords: ["Indian temples", "Khajuraho", "cultural travel", "heritage sites", "temple architecture"],
      canonical_url: "https://synctrip.in/blog/ancient-temples-modern-adventures-india",
      seo_image: blog3.src
    },
    tags: ["Culture", "Temples", "Heritage", "Architecture"],
    author: "Anita Singh",
    readTime: "10 min read",
    category: "Culture",
    rating: "4.7"
  },
  {
    id: "blog_004",
    slug: "budget-backpacking-southeast-asia",
    title: "Budget Backpacking Through Southeast Asia: Complete Guide",
    content: `
      <div class="blog-content">
        <h2>Master the Art of Budget Travel</h2>
        <p>Southeast Asia is a backpacker's paradise, offering incredible experiences without breaking the bank. This comprehensive guide will help you navigate Thailand, Vietnam, and Cambodia on a budget.</p>
        
        <h3>Daily Budget Breakdown</h3>
        <ul>
          <li><strong>Accommodation:</strong> $5-15 per night in hostels/guesthouses</li>
          <li><strong>Food:</strong> $3-8 per day for local meals</li>
          <li><strong>Transportation:</strong> $2-10 per day depending on distance</li>
          <li><strong>Activities:</strong> $5-20 per attraction/tour</li>
        </ul>
        
        <h3>Money-Saving Tips</h3>
        <p>Learn how to stretch your budget further with these proven strategies for accommodation, food, and transportation.</p>
        
        <h3>Must-Visit Destinations</h3>
        <p>From the temples of Angkor Wat to the beaches of Thailand, discover the most rewarding destinations for budget travelers.</p>
        
        <h3>Cultural Etiquette</h3>
        <p>Understanding local customs and traditions will enhance your travel experience and help you connect with local communities.</p>
      </div>
    `,
    featuredImage: blog1.src,
    createdAt: "2024-12-08T10:00:00Z",
    relatedLocations: ["loc_004"],
    seo: {
      seo_title: "Budget Backpacking Southeast Asia Complete Guide | SyncTrip",
      seo_description: "Master budget travel through Thailand, Vietnam, and Cambodia. Complete backpacking guide with money-saving tips and itineraries.",
      seo_keywords: ["budget travel", "backpacking", "Southeast Asia", "Thailand", "Vietnam", "Cambodia"],
      canonical_url: "https://synctrip.in/blog/budget-backpacking-southeast-asia",
      seo_image: blog1.src
    },
    tags: ["Budget Travel", "Backpacking", "Southeast Asia"],
    author: "David Chen",
    readTime: "12 min read",
    category: "Budget Travel",
    rating: "4.6"
  }
];