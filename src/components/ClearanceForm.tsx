
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle, PrinterIcon, HomeIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ClearanceItem {
  id: string;
  title: string;
  department: string;
  completed: boolean;
  signature: string;
  comments?: string;
}

interface ClearanceFormProps {
  employeeName: string;
  jobTitle: string;
  returnToResignation: () => void;
}

const ClearanceForm: React.FC<ClearanceFormProps> = ({ 
  employeeName, 
  jobTitle,
  returnToResignation
}) => {
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
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const isAllCompleted = clearanceItems.every(item => item.completed && item.signature);
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in" dir="rtl">
      <Card className="border-2 border-primary/20 shadow-lg mb-6">
        <div className="gold-accent h-2"></div>
        
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl text-navy-dark">نموذج إخلاء طرف</CardTitle>
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
                  <div className="col-span-2 font-medium">{employeeName}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">الوظيفة:</div>
                  <div className="col-span-2 font-medium">{jobTitle}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">تاريخ طلب إخلاء الطرف:</div>
                  <div className="col-span-2 font-medium">
                    {format(new Date(), "dd MMMM yyyy", { locale: ar })}
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
                onClick={returnToResignation}
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
                onClick={returnToResignation}
              >
                <HomeIcon className="h-4 w-4 ml-2" />
                العودة لنموذج الاستقالة
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Print-only version */}
      <div className="hidden print-only mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">نموذج إخلاء طرف</h1>
        
        <div className="border-2 border-gray-300 p-8 rounded">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">معلومات الموظف</h2>
              <div className="mr-4 space-y-2">
                <p><strong>الاسم:</strong> {employeeName}</p>
                <p><strong>الوظيفة:</strong> {jobTitle}</p>
                <p><strong>تاريخ طلب إخلاء الطرف:</strong> {format(new Date(), "dd MMMM yyyy", { locale: ar })}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-xl font-bold mb-4">بنود إخلاء الطرف</h2>
              {clearanceItems.map((item, index) => (
                <div key={item.id} className="mb-4 mr-4">
                  <p><strong>{index + 1}. {item.title}</strong></p>
                  <p>القسم المسؤول: {item.department}</p>
                  <p>توقيع المسؤول: {item.signature || '______________________'}</p>
                  <p>الحالة: {item.completed ? 'تم التوقيع' : 'معلق'}</p>
                  {index < clearanceItems.length - 1 && <div className="border-b my-2"></div>}
                </div>
              ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-300">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">توقيع الموظف:</p>
                  <div className="mt-4 border-b border-gray-400 w-48"></div>
                </div>
                
                <div>
                  <p className="font-bold">تاريخ التوقيع:</p>
                  <div className="mt-4 border-b border-gray-400 w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>تم تقديم هذا النموذج إلكترونياً بتاريخ {new Date().toLocaleDateString('ar-SA')}</p>
        </div>
      </div>
    </div>
  );
};

export default ClearanceForm;
