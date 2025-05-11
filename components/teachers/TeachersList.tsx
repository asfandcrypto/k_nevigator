"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Clock, 
  MapPin, 
  PhoneCall, 
  BookOpen, 
  Calendar 
} from 'lucide-react';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  if (teachers.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No teachers found
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
        <Card key={teacher._id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {teacher.name}
              </h3>
              <Badge className="w-fit mb-4" variant="outline">
                {teacher.designation}
              </Badge>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{teacher.email}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{teacher.office}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{teacher.officeHours}</span>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Subjects
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeachersList;