"use client";

import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, BookOpen, Info } from 'lucide-react';

const TimetableView = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [timetableData, setTimetableData] = useState([]);
  
  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await fetch('/api/timetable');
      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const getDayClasses = (day: string) => {
    return timetableData.filter(item => item.day.toLowerCase() === day.toLowerCase());
  };

  const renderClasses = (classes) => {
    if (classes.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No classes scheduled
        </div>
      );
    }

    return classes.map((classItem) => (
      <Card key={classItem._id} className="p-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold">{classItem.course}</h4>
              <Badge variant="outline">{classItem.title}</Badge>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {classItem.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {classItem.room}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {classItem.teacher}
              </div>
            </div>
          </div>
          
          <Badge>Semester {classItem.semester}</Badge>
        </div>
      </Card>
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Schedule</h3>
        <div className="flex space-x-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button 
            variant={view === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('grid')}
          >
            Grid View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monday" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="monday">Monday</TabsTrigger>
          <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
          <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
          <TabsTrigger value="thursday">Thursday</TabsTrigger>
          <TabsTrigger value="friday">Friday</TabsTrigger>
        </TabsList>

        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
          <TabsContent key={day} value={day} className="space-y-4">
            {renderClasses(getDayClasses(day))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TimetableView;