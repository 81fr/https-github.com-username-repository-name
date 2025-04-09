import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import { ar } from "date-fns/locale";
import { PrinterIcon, CheckCircle, HomeIcon, DollarSign, CalendarDays, FileText, ShieldCheck, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ClearanceForm from './ClearanceForm';

interface FormData {
  name: string;
  jobTitle: string;
  resignationDate: Date | undefined;
  reason: string;
}

interface SuccessMessageProps {
  formData: FormData;
}

interface FinancialDetails {
  salary: number;
  startDate: Date;
  vacationDays: number;
}

// Create an interface for service duration
interface ServiceDuration {
  years: number;
  months: number;
  decimal: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ formData }) => {
  const [showFinancialCalc, setShowFinancialCalc] = useState(false);
  const [showClearanceForm, setShowClearanceForm] = useState(false);
  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>({
    salary: 0,
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    vacationDays: 0
  });

  const handlePrint = () => {
    window.print();
  };

  const handleFinancialDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      setFinancialDetails(prev => ({
        ...prev,
        startDate: new Date(value)
      }));
    } else {
      setFinancialDetails(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
  };

  // Calculate years of service - updated to always return the same structure
  const calculateYearsOfService = (): ServiceDuration => {
    if (!formData.resignationDate) {
      return {
        years: 0,
        months: 0,
        decimal: 0
      };
    }
    
    const years = differenceInYears(formData.resignationDate, financialDetails.startDate);
    const months = differenceInMonths(formData.resignationDate, financialDetails.startDate) % 12;
    
    return {
      years,
      months,
      decimal: years + (months / 12)
    };
  };

  // Calculate end of service benefits
  const calculateEndOfServiceBenefit = () => {
    const serviceInfo = calculateYearsOfService();
    const { salary } = financialDetails;

    if (serviceInfo.decimal < 2) {
      return 0; // Less than 2 years, no benefit
    } else if (serviceInfo.decimal >= 2 && serviceInfo.decimal <= 5) {
      // Half a month's salary for each year
      return (salary / 2) * serviceInfo.decimal;
    } else {
      // More complex calculation for > 5 years
      // First 5 years: full month salary per year
      // After 5 years: full month salary per year
      const firstFiveYears = 5 * salary;
      const remainingYears = (serviceInfo.decimal - 5) * salary;
      return firstFiveYears + remainingYears;
    }
  };

  // Calculate unused vacation compensation
  const calculateVacationCompensation = () => {
    const { salary } = financialDetails;
    const dailyRate = salary / 30; // Assuming 30 days in a month for simplicity
    return dailyRate * financialDetails.vacationDays;
  };

  // Calculate total financial entitlement
  const calculateTotalEntitlement = () => {
    const endOfServiceBenefit = calculateEndOfServiceBenefit();
    const vacationCompensation = calculateVacationCompensation();
    return endOfServiceBenefit + vacationCompensation;
  };

  const serviceInfo = calculateYearsOfService();

  if (showClearanceForm) {
    return (
      <ClearanceForm 
        employeeName={formData.name}
        jobTitle={formData.jobTitle}
        returnToResignation={() => setShowClearanceForm(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-[fade-in_0.5s_ease-in-out]" dir="rtl">
      <Card className="border-2 border-primary/20 shadow-lg mb-6">
        <div className="gold-accent h-2"></div>
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-navy-dark">تم تقديم الاستقالة بنجاح</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-navy border-b pb-2">تفاصيل الاستقالة</h3>
            
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
                <div className="text-gray-600">تاريخ الاستقالة:</div>
                <div className="col-span-2 font-medium">
                  {formData.resignationDate 
                    ? format(formData.resignationDate, "dd MMMM yyyy", { locale: ar })
                    : "غير محدد"}
                </div>
              </div>
              
              {formData.reason && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">سبب الاستقالة:</div>
                  <div className="col-span-2 font-medium">{formData.reason}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800">
            <p className="text-sm">
              سيتم مراجعة طلبك من قبل إدارة الموارد البشرية وسيتم التواصل معك قريباً.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center">
            {!showFinancialCalc ? (
              <Button 
                onClick={() => setShowFinancialCalc(true)}
                variant="outline"
                className="mt-2"
              >
                <DollarSign className="h-4 w-4 ml-1" />
                حساب المستحقات المالية والقانونية
              </Button>
            ) : null}
            
            <Button 
              onClick={() => setShowClearanceForm(true)}
              variant={showFinancialCalc ? "outline" : "default"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <ClipboardList className="h-4 w-4 ml-1" />
              نموذج إخلاء طرف
            </Button>
          </div>

          {showFinancialCalc && (
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 mt-4">
              <h3 className="font-bold text-lg mb-4 text-navy border-b pb-2 flex items-center">
                <DollarSign className="h-5 w-5 ml-1" />
                حساب المستحقات المالية والقانونية
              </h3>
              
              <div className="space-y-4">
                {/* Form for entering financial details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">الراتب الشهري (ريال):</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      min="0"
                      value={financialDetails.salary || ''}
                      onChange={handleFinancialDetailsChange}
                      placeholder="أدخل الراتب الشهري"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">تاريخ بداية العمل:</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={financialDetails.startDate.toISOString().split('T')[0]}
                      onChange={handleFinancialDetailsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vacationDays">أيام الإجازة غير المستخدمة:</Label>
                    <Input
                      id="vacationDays"
                      name="vacationDays"
                      type="number"
                      min="0"
                      value={financialDetails.vacationDays || ''}
                      onChange={handleFinancialDetailsChange}
                      placeholder="عدد أيام الإجازة المتبقية"
                    />
                  </div>
                </div>

                <Tabs defaultValue="financial" className="w-full mt-6">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="financial" className="flex-1">المستحقات المالية</TabsTrigger>
                    <TabsTrigger value="legal" className="flex-1">الحقوق القانونية</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="financial" className="space-y-4 mt-2">
                    <div className="bg-white p-4 rounded-md border">
                      <h4 className="font-bold mb-3 text-navy-dark">مدة الخدمة</h4>
                      <p className="mb-2">
                        {serviceInfo.years} سنة و {serviceInfo.months} شهر
                      </p>
                      
                      <Separator className="my-3" />
                      
                      <h4 className="font-bold mb-3 text-navy-dark">مكافأة نهاية الخدمة</h4>
                      <div className="mb-2">
                        {serviceInfo.decimal < 2 ? (
                          <p className="text-red-500">مدة الخدمة أقل من سنتين، لا يوجد استحقاق لمكافأة نهاية الخدمة</p>
                        ) : (
                          <p>{calculateEndOfServiceBenefit().toLocaleString()} ريال</p>
                        )}
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <h4 className="font-bold mb-3 text-navy-dark">بدل الإجازات غير المستخدمة</h4>
                      <p className="mb-2">
                        {calculateVacationCompensation().toLocaleString()} ريال
                      </p>
                      
                      <Separator className="my-3" />
                      
                      <div className="font-bold text-lg pt-2 flex justify-between text-navy-dark">
                        <span>إجمالي المستحقات المالية:</span>
                        <span>{calculateTotalEntitlement().toLocaleString()} ريال</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="legal" className="mt-2">
                    <div className="bg-white p-4 rounded-md border space-y-4">
                      <div>
                        <h4 className="font-bold mb-2 flex items-center text-navy-dark">
                          <CalendarDays className="h-4 w-4 ml-1" />
                          فترة الإخطار
                        </h4>
                        <p className="pr-6 text-sm">
                          يجب عليك إعطاء صاحب العمل إشعاراً مسبقاً مدته 30 يوم (قد تختلف حسب العقد).
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center text-navy-dark">
                          <FileText className="h-4 w-4 ml-1" />
                          شهادة الخبرة
                        </h4>
                        <p className="pr-6 text-sm">
                          يحق لك طلب شهادة خبرة بعد انتهاء فترة العمل توضح المسمى الوظيفي ومدة العمل.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center text-navy-dark">
                          <ShieldCheck className="h-4 w-4 ml-1" />
                          التأمينات الاجتماعية
                        </h4>
                        <p className="pr-6 text-sm">
                          تأكد من فهم تأثير الاستقالة على استحقاقاتك في نظام التأمينات الاجتماعية، ويمكنك نقل استحقاقاتك إذا انتقلت للعمل في جهة أخرى.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 no-print">
          <Button 
            className="w-full sm:w-auto flex items-center gap-2 bg-navy hover:bg-navy-light"
            onClick={handlePrint}
          >
            <PrinterIcon className="h-4 w-4" />
            طباعة النموذج
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <HomeIcon className="h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
        </CardFooter>
      </Card>
      
      {/* Print-only version */}
      <div className="hidden print-only mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">نموذج استقالة</h1>
        
        <div className="border-2 border-gray-300 p-8 rounded">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold">الاسم:</h3>
              <p>{formData.name}</p>
            </div>
            
            <div>
              <h3 className="font-bold">الوظيفة:</h3>
              <p>{formData.jobTitle}</p>
            </div>
            
            <div>
              <h3 className="font-bold">تاريخ الاستقالة:</h3>
              <p>
                {formData.resignationDate 
                  ? format(formData.resignationDate, "dd MMMM yyyy", { locale: ar })
                  : "غير محدد"}
              </p>
            </div>
            
            {formData.reason && (
              <div>
                <h3 className="font-bold">سبب الاستقالة:</h3>
                <p>{formData.reason}</p>
              </div>
            )}
            
            {showFinancialCalc && (
              <div>
                <h3 className="font-bold border-t pt-4">المستحقات المالية:</h3>
                <div className="mt-2 mr-4">
                  <p><strong>مدة الخدمة:</strong> {serviceInfo.years} سنة و {serviceInfo.months} شهر</p>
                  <p><strong>مكافأة نهاية الخدمة:</strong> {calculateEndOfServiceBenefit().toLocaleString()} ريال</p>
                  <p><strong>بدل الإجازات غير المستخدمة:</strong> {calculateVacationCompensation().toLocaleString()} ريال</p>
                  <p><strong>إجمالي المستحقات:</strong> {calculateTotalEntitlement().toLocaleString()} ريال</p>
                </div>
              </div>
            )}
            
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

export default SuccessMessage;
