import React, { createContext, useContext, useState, useEffect } from 'react';

export type MetricSystem = 'european' | 'american';

interface MetricContextType {
  metricSystem: MetricSystem;
  setMetricSystem: (system: MetricSystem) => void;
  // Helper conversions
  formatWeight: (kg: number) => string;
  formatHeight: (cm: number) => string;
  formatTemperature: (celsius: number) => string;
  formatDistance: (km: number) => string;
  formatVolume: (liters: number) => string;
  formatGlucose: (mmolL: number) => string;
  weightUnit: string;
  heightUnit: string;
  temperatureUnit: string;
  distanceUnit: string;
  volumeUnit: string;
  glucoseUnit: string;
}

const MetricContext = createContext<MetricContextType | undefined>(undefined);

export function MetricProvider({ children }: { children: React.ReactNode }) {
  const [metricSystem, setMetricSystemState] = useState<MetricSystem>(() => {
    const stored = localStorage.getItem('metricSystem');
    return (stored as MetricSystem) || 'european';
  });

  const setMetricSystem = (system: MetricSystem) => {
    setMetricSystemState(system);
    localStorage.setItem('metricSystem', system);
  };

  const isEuropean = metricSystem === 'european';

  const formatWeight = (kg: number) => {
    if (isEuropean) return `${kg.toFixed(1)} kg`;
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  };

  const formatHeight = (cm: number) => {
    if (isEuropean) return `${cm.toFixed(0)} cm`;
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const formatTemperature = (celsius: number) => {
    if (isEuropean) return `${celsius.toFixed(1)} °C`;
    return `${(celsius * 9 / 5 + 32).toFixed(1)} °F`;
  };

  const formatDistance = (km: number) => {
    if (isEuropean) return `${km.toFixed(1)} km`;
    return `${(km * 0.621371).toFixed(1)} mi`;
  };

  const formatVolume = (liters: number) => {
    if (isEuropean) return `${liters.toFixed(1)} L`;
    return `${(liters * 0.264172).toFixed(1)} gal`;
  };

  const formatGlucose = (mmolL: number) => {
    if (isEuropean) return `${mmolL.toFixed(1)} mmol/L`;
    return `${(mmolL * 18.0182).toFixed(0)} mg/dL`;
  };

  return (
    <MetricContext.Provider value={{
      metricSystem,
      setMetricSystem,
      formatWeight,
      formatHeight,
      formatTemperature,
      formatDistance,
      formatVolume,
      formatGlucose,
      weightUnit: isEuropean ? 'kg' : 'lbs',
      heightUnit: isEuropean ? 'cm' : 'ft/in',
      temperatureUnit: isEuropean ? '°C' : '°F',
      distanceUnit: isEuropean ? 'km' : 'mi',
      volumeUnit: isEuropean ? 'L' : 'gal',
      glucoseUnit: isEuropean ? 'mmol/L' : 'mg/dL',
    }}>
      {children}
    </MetricContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricContext);
  if (!context) throw new Error('useMetrics must be used within a MetricProvider');
  return context;
}
