
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ToastTest = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: "Toast Test",
      description: "If you can see this, the toast system is working!",
      variant: "default",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error Toast",
      description: "This is a destructive toast example",
      variant: "destructive",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Toast Testing Component</h2>
      <p className="text-gray-500">Click the buttons below to test toast functionality</p>
      <div className="space-x-4">
        <Button onClick={showToast}>Show Toast</Button>
        <Button variant="destructive" onClick={showErrorToast}>Show Error Toast</Button>
      </div>
    </div>
  );
};
