import { useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import UnifiedForm from './components/UnifiedForm';
import { Toaster } from './components/ui/toaster';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { FileText, ClipboardList, Eye, Share2 } from 'lucide-react';
import { useToast } from './components/ui/use-toast';

function App() {
  const [activeForm, setActiveForm] = useState<'resignation' | 'clearance'>('resignation');
  const { toast } = useToast();

  const handlePreview = () => {
    window.open(window.location.href, '_blank');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط الموقع إلى الحافظة",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "خطأ في نسخ الرابط",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-end gap-4 mb-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              مشاركة الرابط
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              معاينة الموقع
            </Button>
          </div>
          <div className="flex justify-center mb-8">
            <div className="flex gap-4">
              <Button
                variant={activeForm === 'resignation' ? 'default' : 'outline'}
                onClick={() => setActiveForm('resignation')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                استمارة الاستقالة
              </Button>
              <Button
                variant={activeForm === 'clearance' ? 'default' : 'outline'}
                onClick={() => setActiveForm('clearance')}
                className="flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                استمارة التسوية
              </Button>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {activeForm === 'resignation' ? 'استمارة الاستقالة' : 'استمارة التسوية'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedForm />
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
