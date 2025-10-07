
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressBar from '@/components/common/progressBar';
import Step1Location from '@/components/createTrip/Step1Location';
import Step2SelectDates from '@/components/createTrip/step2Date';
import type { Location } from '@/types';

/**
 * CreateTripScreen.tsx
 *
 * Client-side Create Trip flow (Next.js) that:
 *  - Uses Step1Location and Step2SelectDates components you provided.
 *  - Shows a ProgressBar for 6 steps.
 *  - Reads URL query params to prefill selected location or dates:
 *      ?location=<JSON-encoded-location>
 *      ?locationId=<id>
 *      ?start=YYYY-MM-DD
 *      ?end=YYYY-MM-DD
 *
 *  - Updates URL when user selects things (so the route can carry selected data).
 *  - Provides simple placeholder UIs for steps 3..6 (preferences, budget, privacy, review).
 *
 * Drop this component into a client route (e.g. app/create-trip/page.tsx or a components folder)
 * and ensure the imports point to your actual component paths.
 */

const TOTAL_STEPS = 6;

const formatISODateOnly = (d: Date) => d.toISOString().split('T')[0];

export default function CreateTripScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params (works client-side)
  const locationParam = searchParams?.get('location');
  const locationIdParam = searchParams?.get('locationId');
  const startParam = searchParams?.get('start'); // expected YYYY-MM-DD or ISO
  const endParam = searchParams?.get('end');

  // Decide initial step based on query params:
  // - if both start & end exist => jump to step 3 (dates already chosen)
  // - else if location present => start at step 2 (user likely to pick dates next)
  // - else step 1
  const inferInitialStep = () => {
    if (startParam && endParam) return 3;
    if (locationParam || locationIdParam) return 2;
    return 1;
  };

  const [step, setStep] = useState<number>(inferInitialStep());

  // Trip state
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(startParam ? new Date(startParam) : null);
  const [endDate, setEndDate] = useState<Date | null>(endParam ? new Date(endParam) : null);

  // placeholders for later steps
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [budget, setBudget] = useState<number | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'friends'>('public');

  // Try to parse location param (JSON) or construct lightweight fallback if only id provided.
  useEffect(() => {
    if (locationParam) {
      try {
        const parsed = JSON.parse(locationParam) as Location;
        setSelectedLocation(parsed);
      } catch (err) {
        // not parsable JSON — treat as text and use fallback object
        const fallback: Location = {
          id: locationParam,
          title: locationParam,
          country: '',
          placesNumberToVisit: '',
          photos: ['https://via.placeholder.com/1200x600?text=Location'],
          best_time: '',
        } as Location;
        setSelectedLocation(fallback);
        // In production, you'd fetch details by ID from your API instead.
        console.warn(
          'location query param not JSON. Using fallback location object. Consider passing full JSON or use locationId and fetch server-side.'
        );
      }
    } else if (locationIdParam) {
      const fallbackById: Location = {
        id: locationIdParam,
        title: 'Selected Location',
        country: '',
        placesNumberToVisit: '',
        photos: ['https://via.placeholder.com/1200x600?text=Location'],
        best_time: '',
      } as Location;
      setSelectedLocation(fallbackById);
      console.warn('locationId param detected. Replace fallback with an API fetch for full details.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationParam, locationIdParam]);

  // When start/end query param exist (but state not set), set Date objects
  useEffect(() => {
    if (startParam && !startDate) setStartDate(new Date(startParam));
    if (endParam && !endDate) setEndDate(new Date(endParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam, endParam]);

  /**
   * updateUrlParams
   * Patch the current URL queryparams so the route can carry selected values.
   * - location param is JSON-encoded (if provided)
   * - start / end are formatted as YYYY-MM-DD
   */
  const updateUrlParams = useCallback(
    (patch: { location?: Location | null; start?: Date | null; end?: Date | null }) => {
      // prefer to start from the actual current search string so we don't lose unrelated params
      const sp = new URLSearchParams(window.location.search);

      if ('location' in patch) {
        if (patch.location === null) {
          sp.delete('location');
          sp.delete('locationId');
        } else if (patch.location) {
          try {
            sp.set('location', JSON.stringify(patch.location));
            sp.delete('locationId');
          } catch {
            // fallback to id
            if (patch.location.id) sp.set('locationId', String(patch.location.id));
            sp.delete('location');
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
      const href = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      // replace so browser history is not flooded
      router.replace(href);
    },
    [router]
  );

  // Handlers for Step components
  const handleLocationSelect = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      updateUrlParams({ location });
      // go to dates step
      setStep(2);
    },
    [updateUrlParams]
  );

  const handleDatesSelected = useCallback(
    (start: Date, end: Date) => {
      setStartDate(start);
      setEndDate(end);
      updateUrlParams({ start, end });
      setStep(3);
    },
    [updateUrlParams]
  );

  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // --- Placeholder implementations for steps 3..6 ---
  const Step3Preferences: React.FC = () => {
    const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>({
      adventure: !!preferences.adventure,
      relax: !!preferences.relax,
      culture: !!preferences.culture,
    });

    const toggle = (k: string) => {
      setLocalPrefs((p) => ({ ...p, [k]: !p[k] }));
    };

    const handleNext = () => {
      setPreferences(localPrefs);
      goNext();
    };

    return (
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-3">Trip preferences</h2>
        <p className="text-sm text-gray-600 mb-4">Pick a few preferences to shape your itinerary.</p>

        <div className="flex gap-3 mb-6">
          {(['adventure', 'relax', 'culture'] as const).map((k) => (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`px-4 py-2 rounded-lg border ${
                localPrefs[k] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'
              }`}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={goBack} className="px-4 py-2 rounded-lg border">
            Back
          </button>
          <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            Next
          </button>
        </div>
      </div>
    );
  };

  const Step4Budget: React.FC = () => {
    const [localBudget, setLocalBudget] = useState<number | ''>(budget ?? '');

    const handleNext = () => {
      setBudget(typeof localBudget === 'number' ? localBudget : null);
      goNext();
    };

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-3">Budget</h2>
        <p className="text-sm text-gray-600 mb-4">Enter a per-person budget (optional)</p>

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

        <div className="flex gap-3">
          <button onClick={goBack} className="px-4 py-2 rounded-lg border">
            Back
          </button>
          <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            Next
          </button>
        </div>
      </div>
    );
  };

  const Step5Privacy: React.FC = () => {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-3">Privacy</h2>
        <p className="text-sm text-gray-600 mb-4">Who can see and join your trip?</p>

        <div className="flex flex-col gap-3 mb-6">
          {(['public', 'friends', 'private'] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={privacy === (opt === 'friends' ? 'friends' : (opt as 'public' | 'private'))}
                onChange={() =>
                  setPrivacy(opt === 'friends' ? 'friends' : (opt as 'public' | 'private'))
                }
              />
              <div>
                <div className="font-medium">{opt === 'friends' ? 'Friends only' : opt[0].toUpperCase() + opt.slice(1)}</div>
                <div className="text-sm text-gray-500">
                  {opt === 'public' && 'Anyone can see and join.'}
                  {opt === 'friends' && 'Only friends can see & request to join.'}
                  {opt === 'private' && 'Invite-only trip.'}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={goBack} className="px-4 py-2 rounded-lg border">
            Back
          </button>
          <button onClick={goNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            Next
          </button>
        </div>
      </div>
    );
  };

  const Step6Review: React.FC = () => {
    const handleCreate = async () => {
      // Prepare payload to be POSTed to your backend
      const payload = {
        location: selectedLocation,
        startDate: startDate?.toISOString() ?? null,
        endDate: endDate?.toISOString() ?? null,
        preferences,
        budget,
        privacy,
      };

      // Replace the following with your real API call
      console.log('Create trip payload:', payload);
      alert('Trip created (see console). Redirecting to My Trips...');
      // e.g. router.push('/trips') or similar
    };

    return (
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-3">Review & Create</h2>

        <div className="mb-4 border rounded-lg p-4">
          <h3 className="font-medium">Location</h3>
          <div>{selectedLocation?.title ?? '—'}</div>
        </div>

        <div className="mb-4 border rounded-lg p-4">
          <h3 className="font-medium">Dates</h3>
          <div>{startDate && endDate ? `${startDate.toDateString()} — ${endDate.toDateString()}` : '—'}</div>
        </div>

        <div className="mb-4 border rounded-lg p-4">
          <h3 className="font-medium">Preferences</h3>
          <div>{Object.keys(preferences).filter((k) => (preferences as any)[k]).join(', ') || '—'}</div>
        </div>

        <div className="mb-4 border rounded-lg p-4">
          <h3 className="font-medium">Budget</h3>
          <div>{budget ? `₹ ${budget}` : '—'}</div>
        </div>

        <div className="mb-4 border rounded-lg p-4">
          <h3 className="font-medium">Privacy</h3>
          <div>{privacy}</div>
        </div>

        <div className="flex gap-3">
          <button onClick={goBack} className="px-4 py-2 rounded-lg border">
            Back
          </button>
          <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-green-600 text-white">
            Create Trip
          </button>
        </div>
      </div>
    );
  };

  // --- render main flow ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Create Trip</h1>
          <p className="text-sm text-gray-600">Build a trip — location, dates, preferences & more</p>
        </div>

        <div className="mb-6">
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        <div>
          {step === 1 && (
            <Step1Location
              selectedLocation={selectedLocation ?? undefined}
              onLocationSelect={(loc) => handleLocationSelect(loc)}
            />
          )}

          {step === 2 && (
            <Step2SelectDates
              startDatePreTrip={startDate ? startDate.toISOString() : undefined}
              endDatePreTrip={endDate ? endDate.toISOString() : undefined}
              onDatesSelected={(s, e) => handleDatesSelected(s, e)}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && <Step3Preferences />}

          {step === 4 && <Step4Budget />}

          {step === 5 && <Step5Privacy />}

          {step === 6 && <Step6Review />}
        </div>

        {/* Compact step controls (optional) */}
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
              <button onClick={goNext} className="px-3 py-2 bg-gray-200 rounded">
                Skip / Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default CreateTripScreen;
