"use client";

import React, { useState } from 'react';
// Ensure your import paths are correct based on your project structure
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

interface NestedField {
  value: string;
  subValue?: string;
  isEditing: boolean;
}

interface Field {
  label: string;
  value?: string;
  content?: NestedField[]; // Define 'content' to hold an array of NestedField objects
  isEditing?: boolean;
}

const companyData: Field[] = [
  { label: "Your Company's website", value: "https://www.100xengineers.com", isEditing: false },
  { label: "What's Your Product/Service?", value: "18-week cohort program to become proficient in Generative AI, with a focus on project-based learning and minimal coding experience needed", isEditing: false },
  { label: "Features", content: [
      { value: "Elite Developer Community", subValue: "Join a community of elite developers focused on building startups with Generative AI.", isEditing: false },
      { value: "Industry Expert Mentors", subValue: "Learn from industry mentors with real experience in building AI products.", isEditing: false },
      { value: "Project Based Learning", subValue: "Engage in hands-on projects and practical learning to master Generative AI.", isEditing: false },
      { value: "Future-Proof Your Career", subValue: "Gain in-demand skills in Generative AI to stay ahead in the tech revolution.", isEditing: false },
      { value: "Innovative AI Curriculum", subValue: "Enperience an industry-relevant curriculum designed for immediate application.", isEditing: false },
      { value: "Certification of Mastery", subValue: "Earn a proffessional certificate to validate your expertise in Generative AI.", isEditing: false }
    ]
  },
  { label: "Pain Points", content: [
    { value: "Upskilling in GenAI", subValue: "Leads need upskilling in generative AI with a structured learning process.", isEditing: false },
    { value: "Tutorial Hell", subValue: "Leads struggle with 'tutorial hell', finding many tutorials ineffective.", isEditing: false },
    { value: "Broken Education System", subValue: "Traditional education systems are broken, leading to inefficient learning.", isEditing: false },
    { value: "High Cohort Costs", subValue: "The cost of cohorts is not budget-friendly for self-paying students.", isEditing: false }
    ],
  },
  { label: "Success Stories", content: [
    { value: "Career Advancement for Students", subValue: "Students who completed our program have successfully been placed as AI engineers, showcasing the real-world value and industry recognition of our training.", isEditing: false },
    { value: "Startup Success Post-Program", subValue: "Leveraging the skills and knowledge gained from our course, some of our students have built innovative products and successfully raised funding, demonstrating the entrepreneurial impact of our curriculum.", isEditing: false }
    ]
  }
];

export default function CompanyProfile() {
  const [fields, setFields] = useState<Field[]>(companyData);

  const handleEditToggle = (index: number, contentIndex?: number) => {
    setFields(fields => fields.map((field, i) => {
      if (i === index) {
        if (contentIndex !== undefined && field.content) {
          // Properly typed guard for content property
          const updatedContent = field.content.map((item, ci) => 
            ci === contentIndex ? { ...item, isEditing: !item.isEditing } : item);
          return { ...field, content: updatedContent };
        } else {
          return { ...field, isEditing: !field.isEditing };
        }
      }
      return field;
    }));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, contentIndex: number | undefined, valueType: 'value' | 'subValue') => {
    const newValue = e.target.value;
    setFields(fields => fields.map((field, i) => {
      if (i === index && field.content) {
        const updatedContent = field.content.map((item, ci) => {
          if (ci === contentIndex) {
            return { ...item, [valueType]: newValue };
          }
          return item;
        });
        return { ...field, content: updatedContent };
      }
      return field;
    }));
  };  

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Company Profile</h1>
      {fields.map((field, index) => (
        <Card key={field.label} className="mb-4">
          <CardHeader className="pb-2">
            <CardDescription>{field.label}</CardDescription>
          </CardHeader>
          <CardContent>
            {field.value !== undefined && ( // Check for undefined explicitly if value could be an empty string
              <div className="flex justify-between items-center">
                {field.isEditing ? (
                  <Input 
                    value={field.value}
                    autoFocus
                    onChange={(e) => handleValueChange(e, index, undefined, 'value')} // Adjusted for top-level field editing
                    className="mr-4"
                  />
                ) : (
                  <span className="text-sm">{field.value}</span>
                )}
                <Button onClick={() => handleEditToggle(index)} variant={'ghost'}>
                  {field.isEditing ? <Icons.check size={16} /> : <><Icons.pencilLine size={16} className="mr-3" /><span className="text-sm">Edit</span></>}
                </Button>
              </div>
            )}
            {field.content && field.content.map((content, contentIndex) => (
              <Card key={`${field.label}-content-${contentIndex}`} className="mt-2 w-full">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex-grow flex flex-col justify-between mr-4"> {/* Added margin-right to separate input and button */}
                    {content.isEditing ? (
                      <>
                        <Input
                          value={content.value}
                          autoFocus
                          onChange={(e) => handleValueChange(e, index, contentIndex, 'value')}
                          className="mb-2 w-full" // Ensure Input is full width
                        />
                        <Input
                          value={content.subValue || ''}
                          onChange={(e) => handleValueChange(e, index, contentIndex, 'subValue')}
                          className="mb-4 w-full" // Ensure Input is full width
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm mb-2">{content.value}</p>
                        {content.subValue && <p className="text-xs">{content.subValue}</p>}
                      </>
                    )}
                  </div>
                  <Button onClick={() => handleEditToggle(index, contentIndex)} variant={'ghost'}>
                    {content.isEditing ? (
                      <Icons.check size={16} />
                    ) : (
                      <>
                        <Icons.pencilLine size={16} className="mr-3" />
                        <span className="text-sm">Edit</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

