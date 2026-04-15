import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMetrics, MetricSystem } from '@/contexts/MetricContext';
import { Ruler, Thermometer, Weight, Droplets } from 'lucide-react';

const examples = [
  { label: 'Weight', european: '75.0 kg', american: '165.3 lbs', icon: Weight },
  { label: 'Height', european: '178 cm', american: '5\'10"', icon: Ruler },
  { label: 'Temperature', european: '36.6 °C', american: '97.9 °F', icon: Thermometer },
  { label: 'Blood Glucose', european: '5.5 mmol/L', american: '99 mg/dL', icon: Droplets },
];

export default function SettingsPage() {
  const { metricSystem, setMetricSystem } = useMetrics();

  return (
    <AppShell pageTitle="Settings">
      <div className="space-y-6 max-w-2xl">
        {/* Metric System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Measurement System</CardTitle>
            <CardDescription>
              Choose how measurements are displayed throughout the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={metricSystem}
              onValueChange={(v) => setMetricSystem(v as MetricSystem)}
              className="grid gap-3"
            >
              <Label
                htmlFor="european"
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  metricSystem === 'european'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="european" id="european" />
                <div>
                  <p className="font-medium text-sm">European / Metric (SI)</p>
                  <p className="text-xs text-muted-foreground">
                    Kilograms, centimeters, Celsius, mmol/L
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="american"
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  metricSystem === 'american'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="american" id="american" />
                <div>
                  <p className="font-medium text-sm">American / Imperial</p>
                  <p className="text-xs text-muted-foreground">
                    Pounds, feet/inches, Fahrenheit, mg/dL
                  </p>
                </div>
              </Label>
            </RadioGroup>

            {/* Preview */}
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Preview
              </p>
              <div className="grid grid-cols-2 gap-3">
                {examples.map((ex) => (
                  <div key={ex.label} className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background">
                      <ex.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{ex.label}</p>
                      <p className="text-sm font-medium">
                        {metricSystem === 'european' ? ex.european : ex.american}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
