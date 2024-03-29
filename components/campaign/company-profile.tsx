"use client";

import React, { useState } from 'react';
// Ensure your import paths are correct based on your project structure
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface NestedField {
  title: string;
  description?: string;
  isEditing: boolean;
}

interface Field {
  label: string;
  description?: string;
  details?: NestedField[]; 
  isEditing?: boolean;
  actionLabel?: string;
}

const companyData: Field[] = [
  { label: "Your Company's website", description: "https://www.100xengineers.com", isEditing: false },
  { label: "What's Your Product/Service?", description: "18-week cohort program to become proficient in Generative AI, with a focus on project-based learning and minimal coding experience needed", isEditing: false },
  { label: "Features", details: [
      { title: "Elite Developer Community", description: "Join a community of elite developers focused on building startups with Generative AI.", isEditing: false },
      { title: "Industry Expert Mentors", description: "Learn from industry mentors with real experience in building AI products.", isEditing: false },
      { title: "Project Based Learning", description: "Engage in hands-on projects and practical learning to master Generative AI.", isEditing: false },
      { title: "Future-Proof Your Career", description: "Gain in-demand skills in Generative AI to stay ahead in the tech revolution.", isEditing: false },
      { title: "Innovative AI Curriculum", description: "Enperience an industry-relevant curriculum designed for immediate application.", isEditing: false },
      { title: "Certification of Mastery", description: "Earn a proffessional certificate to validate your expertise in Generative AI.", isEditing: false }
    ], actionLabel: "Feature"
  },
  { label: "Pain Points", details: [
    { title: "Upskilling in GenAI", description: "Leads need upskilling in generative AI with a structured learning process.", isEditing: false },
    { title: "Tutorial Hell", description: "Leads struggle with 'tutorial hell', finding many tutorials ineffective.", isEditing: false },
    { title: "Broken Education System", description: "Traditional education systems are broken, leading to inefficient learning.", isEditing: false },
    { title: "High Cohort Costs", description: "The cost of cohorts is not budget-friendly for self-paying students.", isEditing: false }
    ], actionLabel: "Pain Point"
  },
  { label: "Social Proofs", details: [
    { title: "Career Advancement for Students", description: "Students who completed our program have successfully been placed as AI engineers, showcasing the real-world value and industry recognition of our training.", isEditing: false },
    { title: "Startup Success Post-Program", description: "Leveraging the skills and knowledge gained from our course, some of our students have built innovative products and successfully raised funding, demonstrating the entrepreneurial impact of our curriculum.", isEditing: false }
    ], actionLabel: "Social Proof"
  }
];

export default function CompanyProfile() {
  const [fields, setFields] = useState<Field[]>(companyData);
  const [detailsInput, setDetailsInput] = useState<{ title: string, description: string }>({ title: "", description: "" });

  const toggleEdit = (index: number, detailsIndex?: number) => {
    setFields(fields => fields.map((field, i) => ({
      ...field,
      isEditing: i === index ? !field.isEditing : field.isEditing,
      details: field.details?.map((detail, ci) => ({
        ...detail,
        isEditing: i === index && ci === detailsIndex ? !detail.isEditing : detail.isEditing
      }))
    })));
  };

  const handleFieldChange = (index: number, detailsIndex: number | undefined, valueType: 'title' | 'description') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
  
    setFields(fields => fields.map((field, i) => {
      if (i === index && detailsIndex === undefined && valueType === 'description') {
        return { ...field, description: newValue };
      }
  
      if (i === index && field.details && detailsIndex !== undefined) {
        const updatedDetails = field.details.map((item, ci) => {
          if (ci === detailsIndex) {
            return { ...item, [valueType]: newValue };
          }
          return item;
        });
        return { ...field, details: updatedDetails };
      }
  
      return field;
    }));
  };  
  
  const handleAddDetails = (type: string) => {
    if (detailsInput.title.trim() && detailsInput.description.trim()) {
      setFields(fields => fields.map(field => {
      if (field.label === type) {
        const updatedDetails = field.details ? 
          [...field.details, { ...detailsInput, isEditing: false }] : 
          [{ ...detailsInput, isEditing: false }];
        return { ...field, details: updatedDetails };
      }
      return field;
    }));
  
    setDetailsInput({ title: "", description: "" });
    }
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
            {field.description && (
              <div className="flex justify-between items-center">
                {field.isEditing ? (
                  <Input 
                    value={field.description}
                    autoFocus
                    onChange={handleFieldChange(index, undefined, 'description')}
                    className="mr-4"
                  />
                ) : (
                  <span className="text-sm">{field.description}</span>
                )}
                <Button onClick={() => toggleEdit(index)} variant={'ghost'}>
                  {field.isEditing ? <Icons.check size={16} /> : <><Icons.pencilLine size={16} className="mr-3" /><span className="text-sm">Edit</span></>}
                </Button>
              </div>
            )}
            {field.details && field.details.map((detail, detailsIndex) => (
              <Card key={`${field.label}-detail-${detailsIndex}`} className="mt-2 w-full">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex-grow flex flex-col justify-between mr-4">
                    {detail.isEditing ? (
                      <>
                        <Input
                          value={detail.title}
                          autoFocus
                          onChange={handleFieldChange(index, detailsIndex, 'title')}
                          className="mb-2 w-full" 
                        />
                        <Input
                          value={detail.description || ''}
                          onChange={handleFieldChange(index, detailsIndex, 'description')}
                          className="mb-4 w-full" 
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm mb-2">{detail.title}</p>
                        <p className="text-xs">{detail.description}</p>
                      </>
                    )}
                  </div>
                  <Button onClick={() => toggleEdit(index, detailsIndex)} variant={'ghost'}>
                    {detail.isEditing ? <Icons.check size={16} /> : <><Icons.pencilLine size={16} className="mr-3" /><span className="text-sm">Edit</span></>}
                  </Button>
                </CardContent>
              </Card> 
            ))}

            {field.actionLabel && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 text-sm font-normal" variant={"outline"}>
                    Add {field.actionLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add {field.actionLabel}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        onChange={(e) => setDetailsInput({ ...detailsInput, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        onChange={(e) => setDetailsInput({ ...detailsInput, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    {
                      (detailsInput.title.trim() && detailsInput.description.trim()) ?
                        <DialogClose asChild>
                          <Button type="submit" onClick={() => handleAddDetails(field.label)}>Add</Button>
                        </DialogClose> :
                        <Button type="submit" onClick={() => handleAddDetails(field.label)}>Add</Button>
                    }
                    
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}