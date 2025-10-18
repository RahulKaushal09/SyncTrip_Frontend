'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Step1Location from '@/components/createTrip/Step1Location';
import Step2SelectDates from '@/components/createTrip/step2Date';
import type { Location, UserTrip } from '@/types';
import { ApiService, CommonServices } from '@/utils';
import ProgressBar from '@/components/common/progressBar';
import Step3Preferences from '@/components/createTrip/Step3Preferences';
import Step4Budget from '@/components/createTrip/Step4Budget';
import Step5Privacy from '@/components/createTrip/Step5Privacy';
import { Pencil, MapPin, Calendar, Star, CreditCard, Lock } from "lucide-react";
import TripServices from '@/utils/trip.utils';

const TOTAL_STEPS = 6;
const formatISODateOnly = (d: Date) => d.toISOString().split('T')[0];

export default function CreateTripScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locationIdParam = searchParams?.get('locationId');
  const startParam = searchParams?.get('start');
  const endParam = searchParams?.get('end');

  const inferInitialStep = () => {
    if (locationIdParam && !startParam && !endParam) return 2;
    else if (startParam && endParam) return 3;
    return 1;
  };

  // const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { 
    if( typeof window !== 'undefined' && window.innerWidth<=768){
      setIsMobile(true);

    }
  }, [window]);
  const [step, setStep] = useState<number>(inferInitialStep());
  const [editingFromModify, setEditingFromModify] = useState<boolean>(false);

  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(startParam ? new Date(startParam) : null);
  const [endDate, setEndDate] = useState<Date | null>(endParam ? new Date(endParam) : null);

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>('');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIdParam]);

  useEffect(() => {
    if (startParam && !startDate) setStartDate(new Date(startParam));
    if (endParam && !endDate) setEndDate(new Date(endParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            console.error('Invalid location ID:', patch.location?.id);
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

  const goNext = useCallback(() => {
    setStep((s) => {
      const next = Math.min(TOTAL_STEPS, s + 1);
      if (next === TOTAL_STEPS) {
        setEditingFromModify(false); // arriving at review clears the modify flag
      }
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const canGoNext =
    (step === 1 && !!selectedLocation) || 
    (step === 2 && !!startDate && !!endDate) || 
    (step === 3 && selectedPreferences.length > 0) ||
    (step === 4 && !!selectedBudget) ||
    (step === 5 && !!selectedPrivacy) ||
    step === TOTAL_STEPS;

  
  const publishTripAndNavigateToMatching = useCallback(
    async (manual: boolean) => {
      try {
      }
      catch (err) {
      }
    },
    [selectedLocation, startDate, endDate, selectedBudget, selectedPreferences, selectedPrivacy, router]
  );

  const publishTripAndNavigate = useCallback(
    async (manual: boolean) => {
      try {
        const payload:UserTrip = {
          locationId: selectedLocation?.id ?? '',
          locationName: selectedLocation?.title ?? '',
          startDate: startDate ? formatISODateOnly(startDate) : '',
          endDate: endDate ? formatISODateOnly(endDate) : '',
          budget: selectedBudget,
          interests: selectedPreferences,
          privacy: selectedPrivacy,
        };
        const res = await ApiService.saveTripDetails(payload);
        if (res && res.id) {
          const createdTripId = res.id;
          if (manual) {
            // route to manual planner page
            router.replace(`/userTrip/planner?tripId=${createdTripId}`);
          } else {
            router.replace(`/userTrip/${createdTripId}`);
          }
        } else {
          console.error('Failed to create trip:', res);
        }
      } catch (err) {
        console.error('Error creating trip:', err);
      }
    },
    [selectedLocation, startDate, endDate, selectedBudget, selectedPreferences, selectedPrivacy, router]
  );

  // Memoized header element so ProgressBar does not remount unnecessarily
  const headerEl = useMemo(() => {
    return (
      <div className="mb-6 px-6 pt-6 bg-white">
        <div className="flex items-center">
          {/* back */}
          <div className="mr-4">
            <button
              onClick={() => {
                if (editingFromModify && step < TOTAL_STEPS) {
                  // if we are editing from modify and pressing "back" in header, send back to review
                  setStep(TOTAL_STEPS);
                  setEditingFromModify(false);
                  return;
                }
                if (step > 1) setStep((s) => s - 1);
                else router.back();
              }}
              aria-label="Back"
              className="p-2 rounded hover:bg-gray-100"
            >
              ←
            </button>
          </div>

          <div className="flex-1 mr-6">
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </div>

          <div className="text-sm text-gray-500">
            Step {step} / {TOTAL_STEPS}
          </div>
        </div>
      </div>
    );
  }, [step, editingFromModify, router]);

  // --- Step 6: Modify / Review Component ---
  const Step6Review: React.FC = () => {
    const dateRange =
      startDate && endDate ? CommonServices.formatRange(startDate.toISOString(),endDate.toISOString()) : '—';

    const Card: React.FC<{
      icon: React.ReactNode;
      label: string;
      value: string | React.ReactNode;
      pill?: boolean;
      onEdit: () => void;
    }> = ({ icon, label, value, pill, onEdit }) => {
      return (
        <div className="mb-4 border rounded-lg bg-white p-4 flex items-start justify-between shadow-sm">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-gray-500 mt-1">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800">{label}</div>
              {pill ? (
                <div className="chipsBox mt-2">
                  {typeof value === 'string' && value !== '—' && value.split(', ').map((val, i) => (
                    <span key={`${val}-${i}`} className="chip ">
                      {val}
                    </span>
                  ))}
                  {(!value || (typeof value === 'string' && value === '—')) && (
                    <div className="text-sm text-gray-500 mt-1">Select</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 truncate mt-2">{value}</div>
              )}
            </div>
          </div>

          <div className="ml-3">
            <button
              onClick={onEdit}
              className="p-2 rounded hover:bg-gray-100"
              aria-label={`Edit ${label}`}
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>
      );
    };

    const goEdit = (targetStep: number) => {
      setEditingFromModify(true);
      setStep(targetStep);
      // scroll to top or focus optional
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="">
        <h2 className="DescriptionHeading">
          <strong>Modify Plan</strong>
        </h2>
        <Card
          icon={<MapPin size={18} />}
          label="Location"
          value={selectedLocation?.title || '—'}
          onEdit={() => goEdit(1)}
        />

        <Card
          icon={<Calendar size={18} />}
          label="Dates"
          value={dateRange}
          onEdit={() => goEdit(2)}
        />

        <Card
          icon={<Star size={18} />}
          label="Interests"
          value={selectedPreferences.length ? selectedPreferences.join(', ') : '—'}
          pill
          onEdit={() => goEdit(3)}
        />

        <Card
          icon={<CreditCard size={18} />}
          label="Budget"
          value={selectedBudget || '—'}
          pill
          onEdit={() => goEdit(4)}
        />

        <Card
          icon={<Lock size={18} />}
          label="Privacy"
          value={selectedPrivacy || '—'}
          pill
          onEdit={() => goEdit(5)}
        />

        <div className="mt-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => publishTripAndNavigate(true)}
              className="w-full btn btn-primary-border"
            >
              Make Your Plan Manually
            </button>

            {/* Optional second CTA */}
            {/* <button
              onClick={() => publishTripAndNavigateToMatching(false)}
              className="w-full btn btn-matching-color"
            >
              Start Matching
            </button> */}
          </div>
        </div>
      </div>
    );
  };

  // --- content renderer ---
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1Location initialSelectedLocation={selectedLocation} onSelect={handleLocationSelect} />;
      case 2:
        return (
          <Step2SelectDates
            startDatePreTrip={startDate?.toISOString()}
            endDatePreTrip={endDate?.toISOString()}
            onDatesSelected={handleDatesSelected}
          />
        );
      case 3:
        return <Step3Preferences selectedPreferences={selectedPreferences} setPreferences={setSelectedPreferences} />;
      case 4:
        return <Step4Budget selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget} />;
      case 5:
        return <Step5Privacy selectedPrivacy={selectedPrivacy} setSelectedPrivacy={setSelectedPrivacy} />;
      case 6:
        return <Step6Review />;
      default:
        return (
          <div className="py-10 text-center text-gray-600">Unknown step</div>
        );
    }
  };

  return (
    <div className="" style={{minHeight: '80vh',paddingBottom:20}}>
      <div className="mx-auto bg-white" style={{ maxWidth: '900px' }}>
        {headerEl}

        {/* main content */}
        <div className="px-6">
          {renderStepContent()}
        </div>

        {/* desktop controls */}
        {/* {!isMobile && (
          <div className="flex gap-3 items-center justify-end px-6 mt-6 mb-6">
            {step > 1 && (
              <button onClick={goBack} className="px-3 py-2 border rounded">
                Back
              </button>
            )}
            {step < TOTAL_STEPS && (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={`px-4 py-2 rounded ${canGoNext ? 'bg-primary-600 text-white' : 'bg-blue-100 text-blue-400 cursor-not-allowed'}`}
              >
                Next
              </button>
            )}
          </div>
        )} */}

        {/* mobile controls */}
        {/* {isMobile ? ( */}
        {step !== TOTAL_STEPS && (
          <div className="flex w-full gap-2 mt-5 px-6">
            {step > 1 && (
              <button
                onClick={goBack}
                className="w-1/2 px-3 py-3 border rounded-md font-medium bg-white text-gray-700"
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS && (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={`${step > 1 ? 'w-1/2' : 'w-full'
                  } px-3 py-3 rounded-md font-medium transition-colors ${canGoNext
                    ? 'bg-primary-1 text-white'
                    : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            )}
          </div>
        )}
        {/* ) : null} */}
      </div>
    </div>
  );
}
