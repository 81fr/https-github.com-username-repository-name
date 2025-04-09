
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SuccessMessage from './SuccessMessage';

interface FormData {
  name: string;
  jobTitle: string;
  resignationDate: Date | undefined;
  reason: string;
}

const ResignationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    jobTitle: '',
    resignationDate: undefined,
    reason: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'الوظيفة مطلوبة';
    }
    
    if (!formData.resignationDate) {
      newErrors.resignationDate = 'تاريخ الاستقالة مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, here we would submit to a backend
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      resignationDate: date,
    }));
    
    // Clear error for this field when user selects a date
    if (errors.resignationDate) {
      setErrors(prev => ({
        ...prev,
        resignationDate: undefined,
      }));
    }
  };

  if (isSubmitted) {
    return <SuccessMessage formData={formData} />;
  }

  return (
    <div className="form-container max-w-2xl mx-auto" dir="rtl">
      <div className="gold-accent h-2 rounded-t-lg -mt-6 md:-mt-8 mb-6"></div>
      
      <h1 className="text-3xl font-bold mb-6 text-navy-dark text-center">نموذج تقديم الاستقالة</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="form-label">الاسم الكامل</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                "form-input",
                errors.name && "border-red-500 focus:ring-red-500"
              )}
              placeholder="أدخل الاسم الكامل"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="jobTitle" className="form-label">المسمى الوظيفي</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={cn(
                "form-input",
                errors.jobTitle && "border-red-500 focus:ring-red-500"
              )}
              placeholder="أدخل المسمى الوظيفي"
            />
            {errors.jobTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.jobTitle}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="resignationDate" className="form-label">تاريخ الاستقالة</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-right",
                    !formData.resignationDate && "text-muted-foreground",
                    errors.resignationDate && "border-red-500"
                  )}
                >
                  {formData.resignationDate ? (
                    format(formData.resignationDate, "dd/MM/yyyy", { locale: ar })
                  ) : (
                    <span>اختر التاريخ</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={formData.resignationDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.resignationDate && (
              <p className="mt-1 text-sm text-red-500">{errors.resignationDate}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="reason" className="form-label">سبب الاستقالة (اختياري)</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="form-input min-h-[120px]"
              placeholder="أدخل سبب الاستقالة (اختياري)"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full bg-navy hover:bg-navy-light">
            تقديم الاستقالة
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResignationForm;
