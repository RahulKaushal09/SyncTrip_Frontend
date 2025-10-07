import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';
import { Location } from '@/types';


interface Step1LocationProps {
    selectedLocation?: Location;
    onLocationSelect: (location: Location) => void;
}

const Step1Location: React.FC<Step1LocationProps> = ({ selectedLocation, onLocationSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Mock search function - replace with actual API call
    const searchLocations = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            const mockResults: Location[] = [
                {
                    id: '1',
                    title: 'Paris',
                    country: 'France',
                    placesNumberToVisit: '4',
                    photos: ['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500&h=300&fit=crop'],
                    best_time: 'April - June, September - October',
                },
                
            ].filter(location => 
                location.title.toLowerCase().includes(query.toLowerCase()) ||
                location.country.toLowerCase().includes(query.toLowerCase())
            );
            
            setSearchResults(mockResults);
            setIsSearching(false);
        }, 500);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        searchLocations(value);
    };

    if (selectedLocation) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-64">
                        <img 
                            src={selectedLocation.photos[0]} 
                            alt={selectedLocation.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                            <div className="p-6 text-white">
                                <h2 className="text-3xl font-bold">{selectedLocation.title}</h2>
                                <p className="text-lg opacity-90">{selectedLocation.country}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                                <h3 className="font-semibold text-gray-800">Best Time to Visit</h3>
                            </div>
                            <p className="text-gray-600">{selectedLocation.best_time}</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center mb-3">
                                <MapPin className="w-5 h-5 text-red-500 mr-2" />
                                <h3 className="font-semibold text-gray-800">Popular Places to Visit</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedLocation.placesNumberToVisit && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <span className="text-gray-700">{selectedLocation.placesNumberToVisit} places to visit</span>
                                    </div>
                                )}
                                {/* {selectedLocation.places.map((place, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                                        <span className="text-gray-700">{place}</span>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => onLocationSelect(selectedLocation)}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Continue with {selectedLocation.title}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Where do you want to go?</h1>
                <p className="text-gray-600">Search for your dream destination</p>
            </div>
            
            <div className="relative mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search destinations..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                
                {isSearching && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                )}
                
                {searchResults.length > 0 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-80 overflow-y-auto z-10 shadow-lg">
                        {searchResults.map((location) => (
                            <div
                                key={location.id}
                                onClick={() => onLocationSelect(location)}
                                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <img 
                                    src={location.photos[0]} 
                                    alt={location.title}
                                    className="w-12 h-12 rounded-lg object-cover mr-3"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{location.title}</p>
                                    <p className="text-sm text-gray-500">{location.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step1Location;