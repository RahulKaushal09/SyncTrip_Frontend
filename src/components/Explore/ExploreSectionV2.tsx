import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import LocationCardV2 from '../LocationCard/LocationCardV2';
import { ExplorePageData, Location } from '@/types';
import { typeOfLocationCardEnum } from '@/constants';
import {
    Sparkles, Map, Search, Calendar, MapPin, ChevronDown,
    ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { indianStates } from '@/data/indianStates';
import LocationCard from '../LocationCard/LocationCard';

interface SearchConfig {
    showDestination?: boolean;
    showDates?: boolean;
    showState?: boolean;
    showSearchButton?: boolean;
}

interface ExploreSectionProps {
    locations: Location[];
    isLoading?: boolean;
    hasMoreBtn: boolean;
    handleShowMoreClick?: () => void;
    showMoreButtonToShow: boolean;
    explorePageData: ExplorePageData | undefined;
    searchConfig?: SearchConfig;
    onSearch?: () => void;
    searchTerm?: { term: string, state: string }; // ✅ ADD THIS
}

// ─── Outside Click Hook ────────────────────────────────────────────────────────
const useOutsideClick = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) callback();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, callback]);
};

// ─── Custom Dropdown ───────────────────────────────────────────────────────────
interface DropdownProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    isFocused?: boolean;
    onFocus?: () => void;
    onEnterKey?: () => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({
    value, onChange, options, placeholder, isFocused, onFocus, onEnterKey
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useOutsideClick(ref, () => { setIsOpen(false); setFilter(''); });

    // Auto-open when this segment gets focused from outside
    useEffect(() => {
        if (isFocused && !isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isFocused]);

    const filtered = useMemo(
        () => options.filter(o => o.toLowerCase().includes(filter.toLowerCase())),
        [options, filter]
    );

    const open = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
        onFocus?.();
    };

    const select = (opt: string) => {
        onChange(opt);
        setIsOpen(false);
        setFilter('');
        setHighlightedIndex(-1);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setFilter('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(i => Math.max(i - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
                select(filtered[highlightedIndex]);
                onEnterKey?.();
            } else if (filter === '' && value) {
                setIsOpen(false);
                onEnterKey?.();
            } else if (filtered.length === 1) {
                select(filtered[0]);
                onEnterKey?.();
            } else {
                onEnterKey?.();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setFilter('');
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col justify-center" ref={ref}>
            <div
                className="flex items-center justify-between w-full cursor-pointer gap-2"
                onClick={open}
            >
                <span className={`text-sm md:text-base font-semibold truncate flex-1 ${value ? 'text-[#16324F]' : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    {value && (
                        <button
                            onClick={clear}
                            className="p-0.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X size={12} />
                        </button>
                    )}
                    <ChevronDown
                        size={14}
                        className={`text-[#3ABEF5] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-full md:w-64 bg-white rounded-2xl shadow-[0_16px_48px_rgb(0,0,0,0.14)] border border-gray-100 z-[60] overflow-hidden">
                    {/* Search filter */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                            <Search size={13} className="text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={filter}
                                onChange={e => { setFilter(e.target.value); setHighlightedIndex(0); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Filter states..."
                                className="text-sm font-medium text-[#16324F] bg-transparent outline-none w-full placeholder:text-gray-400"
                            />
                            {filter && (
                                <button onClick={() => setFilter('')} className="text-gray-400 hover:text-gray-600">
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto py-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div
                            className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between ${value === '' ? 'bg-[#E3F5FF] text-[#3ABEF5]' : 'text-[#16324F] hover:bg-gray-50'}`}
                            onClick={() => select('')}
                        >
                            All States
                            {value === '' && <div className="w-1.5 h-1.5 rounded-full bg-[#3ABEF5]" />}
                        </div>
                        {filtered.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-gray-400 text-center">No states found</div>
                        ) : (
                            filtered.map((option, i) => (
                                <div
                                    key={option}
                                    className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between
                                        ${value === option ? 'bg-[#3ABEF5] text-white' : highlightedIndex === i ? 'bg-[#E3F5FF] text-[#3ABEF5]' : 'text-[#16324F] hover:bg-gray-50'}`}
                                    onClick={() => { select(option); onEnterKey?.(); }}
                                    onMouseEnter={() => setHighlightedIndex(i)}
                                >
                                    {option}
                                    {value === option && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Custom Date Picker ────────────────────────────────────────────────────────
interface DatePickerProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date | null) => void;
    isFocused?: boolean;
    onFocus?: () => void;
    onEnterKey?: () => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
    selectedDate, onDateSelect, isFocused, onFocus, onEnterKey
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const [focusedDay, setFocusedDay] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useOutsideClick(ref, () => setIsOpen(false));

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const today = new Date();

    // Open on external focus
    useEffect(() => {
        if (isFocused && !isOpen) {
            setIsOpen(true);
            onFocus?.();
        }
    }, [isFocused]);

    const open = () => { setIsOpen(true); onFocus?.(); };

    const selectDay = (day: number) => {
        onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
        setIsOpen(false);
        onEnterKey?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) { if (e.key === 'Enter' || e.key === ' ') { open(); return; } }
        if (e.key === 'Escape') { setIsOpen(false); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); setFocusedDay(d => d ? Math.min((d ?? 0) + 1, daysInMonth) : 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setFocusedDay(d => d ? Math.max((d ?? 2) - 1, 1) : 1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedDay(d => d ? Math.min((d ?? 0) + 7, daysInMonth) : 1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedDay(d => d ? Math.max((d ?? 8) - 7, 1) : 1); }
        if (e.key === 'Enter' && focusedDay) { selectDay(focusedDay); }
        if (e.key === 'Tab') { setIsOpen(false); onEnterKey?.(); }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`;
    };

    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();

    const isSelected = (day: number) =>
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === currentMonth.getMonth() &&
        selectedDate?.getFullYear() === currentMonth.getFullYear();

    return (
        <div
            className="relative w-full h-full flex flex-col justify-center outline-none"
            ref={ref}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="flex items-center justify-between cursor-pointer gap-2" onClick={open}>
                <span className={`text-sm md:text-base font-semibold truncate flex-1 ${selectedDate ? 'text-[#16324F]' : 'text-gray-400'}`}>
                    {formatDate(selectedDate) || 'Select Dates'}
                </span>
                {selectedDate && (
                    <button
                        onClick={e => { e.stopPropagation(); onDateSelect(null); }}
                        className="p-0.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 shrink-0"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-[300px] bg-white rounded-3xl shadow-[0_16px_48px_rgb(0,0,0,0.14)] border border-gray-100 p-5 z-[60]">

                    {/* Month Nav */}
                    <div className="flex items-center justify-between mb-5">
                        <button
                            onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-[#16324F]"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="text-center">
                            <div className="font-black text-[#16324F] text-sm tracking-wide">
                                {MONTH_NAMES[currentMonth.getMonth()]}
                            </div>
                            <div className="text-xs text-gray-400 font-semibold">{currentMonth.getFullYear()}</div>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-[#16324F]"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_LABELS.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-400 tracking-widest py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const sel = isSelected(day);
                            const tod = isToday(day);
                            const foc = focusedDay === day;

                            return (
                                <button
                                    key={day}
                                    onClick={() => selectDay(day)}
                                    onMouseEnter={() => setFocusedDay(day)}
                                    className={`
                                        aspect-square flex items-center justify-center text-xs font-bold rounded-full mx-auto w-9 h-9 transition-all duration-150
                                        ${sel ? 'bg-[#3ABEF5] text-white shadow-md scale-110' :
                                            foc ? 'bg-[#E3F5FF] text-[#3ABEF5] scale-105' :
                                                tod ? 'text-[#3ABEF5] border-2 border-[#3ABEF5]' :
                                                    'text-[#16324F] hover:bg-[#E3F5FF] hover:text-[#3ABEF5]'}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick shortcuts */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-2">
                            {[
                                { label: 'Today', days: 0 },
                                { label: 'Tomorrow', days: 1 },
                                { label: 'Weekend', days: (6 - today.getDay() + 7) % 7 || 7 },
                            ].map(({ label, days }) => (
                                <button
                                    key={label}
                                    onClick={e => {
                                        e.stopPropagation();
                                        const d = new Date();
                                        d.setDate(d.getDate() + days);
                                        setCurrentMonth(d);
                                        onDateSelect(d);
                                        setIsOpen(false);
                                        onEnterKey?.();
                                    }}
                                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-[#16324F] hover:bg-[#E3F5FF] hover:text-[#3ABEF5] transition-colors"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {selectedDate && (
                            <button
                                onClick={e => { e.stopPropagation(); onDateSelect(null); setIsOpen(false); }}
                                className="text-[10px] font-bold text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Search Widget ─────────────────────────────────────────────────────────────
type SegmentKey = 'destination' | 'dates' | 'region';

const SearchWidget = ({
    onSearch,
    config = { showDestination: true, showDates: false, showState: true, showSearchButton: true }
}: {
    onSearch?: (query: { term: string, state: string }) => void;
    config?: SearchConfig;
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [stateValue, setStateValue] = useState('');
    const [focusedSegment, setFocusedSegment] = useState<SegmentKey | null>(null);
    const destinationRef = useRef<HTMLInputElement>(null);

    // Ordered list of active segments
    const activeSegments = useMemo<SegmentKey[]>(() => {
        const segs: SegmentKey[] = [];
        if (config.showDestination) segs.push('destination');
        if (config.showDates) segs.push('dates');
        if (config.showState) segs.push('region');
        return segs;
    }, [config]);

    const goToNextSegment = useCallback((current: SegmentKey) => {
        const idx = activeSegments.indexOf(current);
        if (idx < activeSegments.length - 1) {
            setFocusedSegment(activeSegments[idx + 1]);
        } else {
            // Last segment — trigger search
            setFocusedSegment(null);
            onSearch?.({ term: searchValue, state: stateValue });
        }
    }, [activeSegments, searchValue, stateValue, onSearch]);

    const handleDestinationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            goToNextSegment('destination');
        }
    };

    const handleSearch = () => {
        onSearch?.({ term: searchValue, state: stateValue });
    };

    if (!config.showDestination && !config.showDates && !config.showState && !config.showSearchButton) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mb-10 sticky top-28 z-50">
            <div className="bg-white/95 backdrop-blur-md md:rounded-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0 transition-all">

                <div className="flex flex-col md:flex-row flex-1 w-full md:divide-x md:divide-gray-100">

                    {/* 1. Destination */}
                    {config.showDestination && (
                        <div
                            className={`flex-1 w-full flex flex-col px-4 md:px-6 py-2 md:py-1 h-14 justify-center rounded-2xl md:rounded-l-full transition-all cursor-text
                                ${focusedSegment === 'destination' ? 'bg-[#E3F5FF]/60 ring-2 ring-[#3ABEF5]/30 ring-inset' : 'hover:bg-gray-50/50'}`}
                            onClick={() => { destinationRef.current?.focus(); setFocusedSegment('destination'); }}
                        >
                            <label className="text-[10px] font-bold text-[#16324F]/50 tracking-wider mb-0.5 flex items-center gap-1 pointer-events-none">
                                <Search size={10} strokeWidth={3} /> DESTINATION
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    ref={destinationRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={e => { setSearchValue(e.target.value); if (!e.target.value) onSearch?.({ term: '', state: stateValue }); }}
                                    onKeyDown={handleDestinationKeyDown}
                                    onFocus={() => setFocusedSegment('destination')}
                                    onBlur={() => setFocusedSegment(null)}
                                    placeholder="Where to?"
                                    className="text-sm md:text-base font-semibold text-[#16324F] outline-none bg-transparent placeholder:text-gray-400 w-full truncate"
                                />
                                {searchValue && (
                                    <button
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={() => { setSearchValue(''); onSearch?.({ term: '', state: stateValue }); destinationRef.current?.focus(); }}
                                        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600 shrink-0"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. Dates */}
                    {config.showDates && (
                        <div
                            className={`flex-1 w-full flex flex-col px-4 md:px-6 py-2 md:py-1 h-14 justify-center rounded-2xl transition-all relative
                                ${focusedSegment === 'dates' ? 'bg-[#E3F5FF]/60 ring-2 ring-[#3ABEF5]/30 ring-inset' : 'hover:bg-gray-50/50'}`}
                        >
                            <label className="text-[10px] font-bold text-[#16324F]/50 tracking-wider mb-0.5 flex items-center gap-1 pointer-events-none">
                                <Calendar size={10} strokeWidth={3} /> DATES
                            </label>
                            <CustomDatePicker
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                isFocused={focusedSegment === 'dates'}
                                onFocus={() => setFocusedSegment('dates')}
                                onEnterKey={() => goToNextSegment('dates')}
                            />
                        </div>
                    )}

                    {/* 3. Region */}
                    {config.showState && (
                        <div
                            className={`flex-1 w-full flex flex-col px-4 md:px-6 py-2 md:py-1 h-14 justify-center rounded-2xl md:rounded-r-full transition-all relative
                                ${focusedSegment === 'region' ? 'bg-[#E3F5FF]/60 ring-2 ring-[#3ABEF5]/30 ring-inset' : 'hover:bg-gray-50/50'}`}
                        >
                            <label className="text-[10px] font-bold text-[#16324F]/50 tracking-wider mb-0.5 flex items-center gap-1 pointer-events-none">
                                <MapPin size={10} strokeWidth={3} /> REGION
                            </label>
                            <CustomDropdown
                                value={stateValue}
                                onChange={setStateValue}
                                options={indianStates}
                                placeholder="All States"
                                isFocused={focusedSegment === 'region'}
                                onFocus={() => setFocusedSegment('region')}
                                onEnterKey={() => goToNextSegment('region')}
                            />
                        </div>
                    )}
                </div>

                {/* Search Button */}
                {config.showSearchButton && (
                    <div className="px-2 w-full md:w-auto mt-2 md:mt-0">
                        <button
                            onClick={handleSearch}
                            className="w-full md:w-auto bg-[#3ABEF5] hover:bg-[#007EB2] active:scale-95 text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Search size={16} strokeWidth={2.5} />
                            <span>Search</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Category Slider ───────────────────────────────────────────────────────────
const CategorySlider = ({
    title, subtitle, icon: Icon, data, isLoading
}: {
    title: string; subtitle?: string; icon: React.ElementType; data: Location[]; isLoading: boolean;
}) => {
    if (!isLoading && data.length === 0) return null;
    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4 px-4 md:px-8">
                <div className="p-2 bg-[#E3F5FF] text-[#3ABEF5] rounded-xl">
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#16324F] tracking-tight leading-none m-0">{title}</h2>
                    {subtitle && <p className="text-[#16324F]/60 text-sm font-medium mt-1 m-0">{subtitle}</p>}
                </div>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-5 md:px-10 pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <LocationCardV2 key={`sk-${i}`} isLoading={true} typeOfWhishlistCardEnum="location" />
                    ))
                    : data.map((loc, i) => (
                        <LocationCardV2
                            key={loc.id || i}
                            name={loc.title?.replace(/[0-9.]/g, '') || 'Unknown Destination'}
                            rating={loc.rating || 'N/A'}
                            places={loc.placesNumberToVisit as string}
                            images={loc.images?.length ? loc.images : []}
                            cardId={loc.id}
                            isLoading={false}
                            typeOfCard={typeOfLocationCardEnum.location}
                            state={loc.state || ""}
                            country={loc.country || "India"}
                        />
                    ))}
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ExploreSectionV2: React.FC<ExploreSectionProps> = ({
    explorePageData,
    locations,
    isLoading = false,
    hasMoreBtn,
    handleShowMoreClick,
    showMoreButtonToShow,
    searchConfig = { showDestination: true, showDates: false, showState: true, showSearchButton: true },
    onSearch,
    searchTerm = { term: '', state: '' }
}) => {
    const isSearching = (searchTerm?.term ?? '').trim().length > 0 || (searchTerm?.state ?? '').trim().length > 0;

    const gridLocations = locations || [];

    return (
        <section className="w-full max-w-[1400px] mx-auto py-12 bg-transparent relative" aria-label="Explore destinations">

            <SearchWidget onSearch={onSearch} config={searchConfig} />

            <div className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${isSearching ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-8'}`}>
                <div className="overflow-hidden">
                    {explorePageData && Array.isArray(explorePageData) && explorePageData.map((item, key) => (
                        <CategorySlider
                            key={key}
                            title={item.heading || ""}
                            subtitle={item.subHeading || ""}
                            icon={Sparkles}
                            data={item.data ?? []}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>

            <div className="px-4 md:px-8 flex flex-col items-center">
                <div className="w-full mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-[#16324F] tracking-tight m-0">
                        {isSearching ? `Results for "${searchTerm?.term || ''}"` : 'All Destinations'}
                    </h2>
                    {isSearching && gridLocations.length > 0 && (
                        <p className="text-[#16324F]/50 text-sm font-medium mt-1">
                            {gridLocations.length} destination{gridLocations.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {isLoading && gridLocations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 w-full">
                        <div className="w-10 h-10 rounded-full border-4 border-[#3ABEF5] border-t-transparent animate-spin mb-4" />
                    </div>
                ) : gridLocations.length === 0 && isSearching ? (
                    <div className="text-center py-20 w-full">
                        <div className="w-16 h-16 bg-[#E3F5FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search size={28} className="text-[#3ABEF5]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#16324F] mb-2">No destinations found</h3>
                        <p className="text-[#16324F]/60">No matches for "{searchTerm?.term || ''}". Try another location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full justify-items-center">
                        {gridLocations.map((loc, i) => (
                            <div key={loc.id || i} className="w-full flex justify-center">
                                <LocationCard
                                    name={loc.title?.replace(/[0-9.]/g, '') || 'Unknown Destination'}
                                    rating={loc.rating || 'N/A'}
                                    places={loc.placesNumberToVisit as string}
                                    images={loc.images?.length ? loc.images : []}
                                    isWishlisted={loc.isWishlisted || false}
                                    typeOfWhishlistCardEnum="location"
                                    cardId={loc.id}
                                    placeConnectedwithid=""
                                    isLoading={isLoading}
                                    typeOfCard={typeOfLocationCardEnum.location}
                                    showWishlistIcon={false}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {hasMoreBtn && showMoreButtonToShow && !isSearching && (
                    <button
                        onClick={handleShowMoreClick}
                        className="mt-12 px-8 py-3 rounded-full border-2 border-[#3ABEF5] text-[#3ABEF5] font-bold text-sm md:text-base hover:bg-[#3ABEF5] hover:text-white transition-colors duration-300 shadow-sm"
                    >
                        View More Destinations
                    </button>
                )}
            </div>
        </section>
    );
};

export default ExploreSectionV2;