import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, BookOpen, Shield, Globe, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const resources = [
  {
    name: 'MedlinePlus',
    url: 'https://medlineplus.gov',
    description: 'Run by the National Library of Medicine, offering comprehensive, patient-friendly information.',
    icon: BookOpen,
    badge: 'Patient-Friendly'
  },
  {
    name: 'Centers for Disease Control and Prevention',
    url: 'https://cdc.gov',
    description: 'Authoritative source for public health, safety, and disease info.',
    icon: Shield,
    badge: 'Public Health'
  },
  {
    name: 'Mayo Clinic',
    url: 'https://mayoclinic.org',
    description: 'High-quality, doctor-approved medical information.',
    icon: BookOpen,
    badge: 'Doctor-Approved'
  },
  {
    name: 'National Institutes of Health',
    url: 'https://nih.gov',
    description: 'Premier biomedical research center.',
    icon: Database,
    badge: 'Research'
  },
  {
    name: 'World Health Organization',
    url: 'https://who.int',
    description: 'Global public health information.',
    icon: Globe,
    badge: 'Global'
  },
  {
    name: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    description: 'Database for biomedical literature (more technical).',
    icon: Database,
    badge: 'Technical'
  },
];

export default function MedicalResourcesPage() {
  return (
    <AppShell contextPanel={<div />}> {/* Empty context panel */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Reliable Medical Resources</h1>
          <p className="text-muted-foreground">
            Top reliable health websites for accurate, trustworthy medical information.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.name} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <resource.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{resource.name}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {resource.url}
                      </CardDescription>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                    {resource.badge}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {resource.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> These resources are provided for educational purposes only. 
            Always consult with your healthcare provider for personalized medical advice and treatment decisions.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
