import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackToButton from "./back-to-button";

interface FormPageLayoutProps {
  /** Where the back button should navigate */
  backTo: string;
  /** Label for the back button */
  backLabel: string;
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Form card title */
  formTitle: string;
  /** Form card description */
  formDescription: string;
  /** Form content */
  children: ReactNode;
}

export function FormPageLayout({
  backTo,
  backLabel,
  title,
  description,
  formTitle,
  formDescription,
  children,
}: FormPageLayoutProps) {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BackToButton to={backTo} label={backLabel} />
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
          <CardDescription>{formDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export default FormPageLayout;