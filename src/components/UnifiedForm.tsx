import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle, PrinterIcon, HomeIcon, CalendarIcon } from "lucide-react";
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import SuccessMessage from './SuccessMessage';

interface FormData {
  name: string;
  jobTitle: string;
  startDate: Date | undefined;
  resignationDate: Date | undefined;
  reason: string;
  serviceDuration: string;
}

interface ClearanceItem {
  id: string;
  title: string;
  department: string;
  completed: boolean;
  signature: string;
  comments?: string;
}

const UnifiedForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'resignation' | 'clearance'>('resignation');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    jobTitle: '',
    startDate: undefined,
    resignationDate: undefined,
    reason: '',
    serviceDuration: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clearanceStatus, setClearanceStatus] = useState<'inProgress' | 'completed'>('inProgress');
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([
    { 
      id: 'it-equipment', 
      title: 'إعادة جميع معدات تقنية المعلومات',
      department: 'قسم تقنية المعلومات', 
      completed: false,
      signature: '' 
    },
    { 
      id: 'access-cards', 
      title: 'تسليم بطاقات الدخول والمفاتيح',
      department: 'الأمن', 
      completed: false,
      signature: '' 
    },
    { 
      id: 'financial-clearance', 
      title: 'تسوية جميع المستحقات المالية',
      department: 'المالية', 
      completed: false,
      signature: '' 
    },
    { 
      id: 'hr-documents', 
      title: 'توقيع جميع مستندات الموارد البشرية',
      department: 'الموارد البشرية', 
      completed: false,
      signature: '' 
    },
    { 
      id: 'property', 
      title: 'إرجاع جميع ممتلكات الشركة',
      department: 'الإدارة', 
      completed: false, 
      signature: '' 
    }
  ]);

  // Resignation Form Functions
  const validateResignationForm = (): boolean => {
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
  
  const handleResignationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateResignationForm()) {
      setCurrentStep('clearance');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
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
    
    if (errors.resignationDate) {
      setErrors(prev => ({
        ...prev,
        resignationDate: undefined,
      }));
    }
  };

  const calculateServiceDuration = (startDate: Date | undefined, endDate: Date | undefined): string => {
    if (!startDate || !endDate) return '';
    
    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate) % 12;
    const days = differenceInDays(endDate, startDate) % 30;
    
    let duration = '';
    if (years > 0) {
      duration += `${years} سنة `;
    }
    if (months > 0 || years === 0) {
      duration += `${months} شهر `;
    }
    if (days > 0 || (years === 0 && months === 0)) {
      duration += `${days} يوم`;
    }
    
    return duration.trim();
  };

  useEffect(() => {
    if (formData.startDate && formData.resignationDate) {
      const duration = calculateServiceDuration(formData.startDate, formData.resignationDate);
      setFormData(prev => ({
        ...prev,
        serviceDuration: duration
      }));
    }
  }, [formData.startDate, formData.resignationDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      startDate: date,
    }));
  };

  // Clearance Form Functions
  const handleCheckChange = (id: string, checked: boolean) => {
    setClearanceItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: checked } : item
      )
    );
  };
  
  const handleSignatureChange = (id: string, value: string) => {
    setClearanceItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, signature: value } : item
      )
    );
  };
  
  const completeClearance = () => {
    setClearanceStatus('completed');
    setIsSubmitted(true);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const isAllCompleted = clearanceItems.every(item => item.completed && item.signature);

  if (isSubmitted) {
    return <SuccessMessage formData={formData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2"
        >
          <HomeIcon className="h-4 w-4" />
          العودة للرئيسية
        </Button>
      </div>
      {currentStep === 'resignation' ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-navy-dark text-center">نموذج الاستقالة</h1>
          
          <form onSubmit={handleResignationSubmit} className="space-y-6">
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
                <Label htmlFor="startDate" className="form-label">تاريخ بداية العمل</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-right",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      {formData.startDate ? (
                        format(formData.startDate, "dd/MM/yyyy", { locale: ar })
                      ) : (
                        <span>اختر التاريخ</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

              {formData.serviceDuration && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-gray-700">مدة الخدمة</Label>
                  <p className="text-lg font-semibold text-navy-dark mt-1">{formData.serviceDuration}</p>
                </div>
              )}
              
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
            
            <div className="flex justify-between items-center">
              <Button type="submit" className="w-full">
                التالي
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="ml-4"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                طباعة النموذج
              </Button>
            </div>
          </form>
        </>
      ) : (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-navy-dark">نموذج الاستقالة</CardTitle>
            <p className="text-gray-600 mt-2">
              يجب إكمال هذا النموذج وتوقيعه من قبل الأقسام المعنية قبل مغادرة الموظف للمنشأة
            </p>
          </CardHeader>
          
          {clearanceStatus === 'inProgress' ? (
            <CardContent className="pt-6 space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-navy border-b pb-2">معلومات الموظف</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">الاسم:</div>
                    <div className="col-span-2 font-medium">{formData.name}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">الوظيفة:</div>
                    <div className="col-span-2 font-medium">{formData.jobTitle}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">تاريخ بداية العمل:</div>
                    <div className="col-span-2 font-medium">
                      {format(formData.startDate, "dd MMMM yyyy", { locale: ar })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-6 text-navy border-b pb-2">بنود إخلاء الطرف</h3>
                
                {clearanceItems.map((item, index) => (
                  <div key={item.id} className="mb-6">
                    <div className="flex items-start space-x-4 mb-2 space-x-reverse">
                      <div className="ml-3 mt-0.5">
                        <Checkbox 
                          id={item.id} 
                          checked={item.completed}
                          onCheckedChange={(checked) => handleCheckChange(item.id, checked as boolean)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={item.id} className="text-lg font-medium cursor-pointer">
                          {item.title}
                        </Label>
                        <p className="text-gray-500 text-sm mt-1">القسم المسؤول: {item.department}</p>
                        {item.id === 'financial-clearance' && formData.serviceDuration && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800">
                              <span className="font-semibold">مدة الخدمة:</span> {formData.serviceDuration}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              <span className="font-semibold">تاريخ بداية العمل:</span> {format(formData.startDate!, "dd MMMM yyyy", { locale: ar })}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              <span className="font-semibold">تاريخ نهاية الخدمة:</span> {format(formData.resignationDate!, "dd MMMM yyyy", { locale: ar })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pr-9 mt-2">
                      <Label 
                        htmlFor={`${item.id}-signature`} 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        توقيع المسؤول:
                      </Label>
                      <Input
                        id={`${item.id}-signature`}
                        placeholder="اسم وتوقيع المسؤول"
                        value={item.signature}
                        onChange={(e) => handleSignatureChange(item.id, e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                    
                    {index < clearanceItems.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
                
                <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800">
                  <p className="text-sm">
                    يرجى التأكد من إكمال جميع البنود والحصول على التوقيعات المطلوبة قبل تقديم النموذج.
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-6 space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">تم إكمال إخلاء الطرف بنجاح</h3>
                <p className="text-gray-600">
                  تم توثيق جميع بنود إخلاء الطرف وتوقيعها من قبل الأقسام المعنية.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-navy border-b pb-2">تفاصيل إخلاء الطرف</h3>
                
                {clearanceItems.map((item, index) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          تم التوقيع بواسطة: {item.signature} ({item.department})
                        </p>
                      </div>
                    </div>
                    {index < clearanceItems.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4 pb-6 no-print">
            {clearanceStatus === 'inProgress' ? (
              <>
                <Button 
                  className="w-full sm:w-auto flex-1 bg-navy hover:bg-navy-light"
                  onClick={completeClearance}
                  disabled={!isAllCompleted}
                >
                  <FileText className="h-4 w-4 ml-2" />
                  إكمال إخلاء الطرف
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto flex-1"
                  onClick={() => setCurrentStep('resignation')}
                >
                  <HomeIcon className="h-4 w-4 ml-2" />
                  العودة لنموذج الاستقالة
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="w-full sm:w-auto flex-1 bg-navy hover:bg-navy-light"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="h-4 w-4 ml-2" />
                  طباعة النموذج
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto flex-1"
                  onClick={() => setCurrentStep('resignation')}
                >
                  <HomeIcon className="h-4 w-4 ml-2" />
                  العودة لنموذج الاستقالة
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default UnifiedForm; 