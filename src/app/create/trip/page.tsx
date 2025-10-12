'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Step1Location from '@/components/createTrip/Step1Location';
import Step2SelectDates from '@/components/createTrip/step2Date';
import type { Location } from '@/types';
import { ApiService } from '@/utils';

const TOTAL_STEPS = 6;

const formatISODateOnly = (d: Date) => d.toISOString().split('T')[0];

export default function CreateTripScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locationIdParam = searchParams?.get('locationId');
  const startParam = searchParams?.get('start');
  const endParam = searchParams?.get('end');

  const inferInitialStep = () => {
    if(locationIdParam && !startParam && !endParam) return 2;
    else if (startParam && endParam) return 3;
    return 1;
  };

  const [step, setStep] = useState<number>(inferInitialStep());
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [startDate, setStartDate] = useState<Date | null>(startParam ? new Date(startParam) : null);
  const [endDate, setEndDate] = useState<Date | null>(endParam ? new Date(endParam) : null);

  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [budget, setBudget] = useState<number | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'friends'>('public');

  useEffect(() => {
    const parseLocationId = async () => {
      if (locationIdParam && !selectedLocation) {
        try {
          const loc = await ApiService.fetchLocationById(locationIdParam);
          if (loc) setSelectedLocation(loc);
        } catch (err) {
          console.error('Error fetching location by ID:', err);
        }
      }
    };
    parseLocationId();
  }, [locationIdParam, selectedLocation]);

  useEffect(() => {
    if (startParam && !startDate) setStartDate(new Date(startParam));
    if (endParam && !endDate) setEndDate(new Date(endParam));
  }, [startParam, endParam]);

  const updateUrlParams = useCallback(
    (patch: { location?: Location | null; start?: Date | null; end?: Date | null }) => {
      const sp = new URLSearchParams(window.location.search);
      if ('location' in patch) {
        if (patch.location === null) {
          sp.delete('locationId');
        } else if (patch.location) {
          try {
            if (patch.location.id) sp.set('locationId', String(patch.location.id));

          } catch {
            console.error('Invalid location ID:', patch.location.id);
          }
        }
      }
      if ('start' in patch) {
        if (patch.start) sp.set('start', formatISODateOnly(patch.start));
        else sp.delete('start');
      }
      if ('end' in patch) {
        if (patch.end) sp.set('end', formatISODateOnly(patch.end));
        else sp.delete('end');
      }
      const query = sp.toString();
      router.replace(query ? `${window.location.pathname}?${query}` : window.location.pathname);
    },
    [router]
  );

  const handleLocationSelect = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      updateUrlParams({ location });
    },
    [updateUrlParams]
  );

  const handleDatesSelected = useCallback(
    (start: Date, end: Date) => {
      setStartDate(start);
      setEndDate(end);
      updateUrlParams({ start, end });
    },
    [updateUrlParams]
  );

  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // --- dynamic button enable logic ---
  const canGoNext =
    (step === 1 && !!selectedLocation) ||
    (step === 2 && !!startDate && !!endDate) ||
    step > 2;

  // --- Placeholder steps (same as before, trimmed for brevity) ---
  const Step3Preferences = () => (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Trip preferences</h2>
      <p className="text-sm text-gray-600 mb-4">Pick preferences.</p>
      <div className="flex gap-3 mb-6">
        {['adventure', 'relax', 'culture'].map((k) => (
          <button
            key={k}
            onClick={() => setPreferences((p) => ({ ...p, [k]: !p[k] }))}
            className={`px-4 py-2 rounded-lg border ${preferences[k] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'
              }`}
          >
            {k}
          </button>
        ))}
      </div>
      
    </div>
  );

  const Step4Budget = () => {
    const [localBudget, setLocalBudget] = useState<number | ''>(budget ?? '');
    const handleNext = () => {
      setBudget(typeof localBudget === 'number' ? localBudget : null);
      goNext();
    };
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-3">Budget</h2>
        <input
          type="number"
          placeholder="e.g. 15000"
          value={localBudget}
          onChange={(e) => {
            const v = e.target.value;
            setLocalBudget(v === '' ? '' : Number(v));
          }}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        
      </div>
    );
  };

  const Step5Privacy = () => (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Privacy</h2>
      {['public', 'friends', 'private'].map((opt) => (
        <label key={opt} className="flex items-center gap-3 border p-3 rounded-lg mb-3 cursor-pointer">
          <input
            type="radio"
            name="privacy"
            checked={privacy === opt}
            onChange={() => setPrivacy(opt as any)}
          />
          <span className="capitalize">{opt}</span>
        </label>
      ))}
      
    </div>
  );

  const Step6Review = () => (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Review</h2>
      <div className="mb-3 border p-3 rounded-lg">
        <strong>Location:</strong> {selectedLocation?.title || '—'}
      </div>
      <div className="mb-3 border p-3 rounded-lg">
        <strong>Dates:</strong>{' '}
        {startDate && endDate
          ? `${startDate.toDateString()} – ${endDate.toDateString()}`
          : '—'}
      </div>
      
    </div>
  );

  // --- render main flow ---
  return (
    <div className="py-8">
      <div className="mx-auto bg-white" style={{ maxWidth: "80%" }}>
        {step === 1 && (
          <Step1Location
            initialSelectedLocation={selectedLocation}
            onSelect={handleLocationSelect}
          />
        )}
        {step === 2 && (
          <Step2SelectDates
            startDatePreTrip={startDate?.toISOString()}
            endDatePreTrip={endDate?.toISOString()}
            onDatesSelected={handleDatesSelected}
            
          />
        )}
        {step === 3 && <Step3Preferences />}
        {step === 4 && <Step4Budget />}
        {step === 5 && <Step5Privacy />}
        {step === 6 && <Step6Review />}

        {/* Step controls */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            Step {step} / {TOTAL_STEPS}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button onClick={goBack} className="px-3 py-2 border rounded">
                Back
              </button>
            )}
            {step < TOTAL_STEPS && (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={`px-3 py-2 rounded ${canGoNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
