"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LocationsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const filterLocations = (type) => {
    return locations.filter(location => {
      const matchesType = location.type === type;
      const matchesSearch = searchQuery.toLowerCase() === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.building.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const renderLocationsList = (type) => {
    const filteredLocations = filterLocations(type);
    
    if (filteredLocations.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No {type}s found
        </div>
      );
    }

    return filteredLocations.map((location) => (
      <div 
        key={location._id} 
        className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {location.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {location.building}, Floor {location.floor}
            </p>
            {location.capacity && (
              <Badge variant="secondary" className="mt-2">
                Capacity: {location.capacity}
              </Badge>
            )}
            {location.facilities && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Facilities: {location.facilities}
              </p>
            )}
            {location.occupant && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Occupant: {location.occupant}
              </p>
            )}
          </div>
          <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    ));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Locations Directory</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search locations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classrooms">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="offices">Offices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classrooms" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {renderLocationsList('classroom')}
          </TabsContent>
          
          <TabsContent value="labs" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {renderLocationsList('lab')}
          </TabsContent>
          
          <TabsContent value="offices" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {renderLocationsList('office')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocationsList;