import { Calendar, ChevronDown, ChevronLeft, ChevronRight, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchConfig } from "../Explore/ExploreSectionV2";
import { indianStates } from "@/data/indianStates";
import "../../../styles/SearchWidget.css"; // IMPORTANT: Import the new CSS file

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
        <div className="sw-input-row" ref={ref}>
            <div className="sw-input-row" style={{ cursor: 'pointer' }} onClick={open}>
                <span className="sw-input" style={{ color: value ? 'var(--sw-text-main)' : 'var(--sw-text-muted)' }}>
                    {value || placeholder}
                </span>

                {value && (
                    <button onClick={clear} className="sw-clear-btn">
                        <X size={12} />
                    </button>
                )}
                <ChevronDown
                    size={14}
                    style={{
                        color: 'var(--sw-primary)',
                        transition: 'var(--sw-transition)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
                    }}
                />
            </div>

            {isOpen && (
                <div className="sw-popup">
                    <div className="sw-dropdown-search-box">
                        <div className="sw-dropdown-search-inner">
                            <Search size={13} color="var(--sw-text-muted)" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={filter}
                                onChange={e => { setFilter(e.target.value); setHighlightedIndex(0); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search states..."
                                className="sw-input"
                            />
                            {filter && (
                                <button onClick={() => setFilter('')} className="sw-clear-btn">
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="sw-dropdown-list">
                        <div
                            className={`sw-dropdown-item ${value === '' ? 'is-highlighted' : ''}`}
                            onClick={() => { select(''); onEnterKey?.(); }}
                        >
                            All States
                            {value === '' && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--sw-primary)' }} />}
                        </div>
                        {filtered.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--sw-text-muted)' }}>
                                No states found
                            </div>
                        ) : (
                            filtered.map((option, i) => (
                                <div
                                    key={option}
                                    className={`sw-dropdown-item ${value === option ? 'is-selected' : highlightedIndex === i ? 'is-highlighted' : ''}`}
                                    onClick={() => { select(option); onEnterKey?.(); }}
                                    onMouseEnter={() => setHighlightedIndex(i)}
                                >
                                    {option}
                                    {value === option && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'white' }} />}
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

    useEffect(() => {
        if (isFocused && !isOpen) { setIsOpen(true); onFocus?.(); }
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
            className="sw-input-row"
            ref={ref}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ height: '100%', outline: 'none' }}
        >
            <div className="sw-input-row" style={{ cursor: 'pointer' }} onClick={open}>
                <span className="sw-input" style={{ color: selectedDate ? 'var(--sw-text-main)' : 'var(--sw-text-muted)' }}>
                    {formatDate(selectedDate) || 'Select Dates'}
                </span>
                {selectedDate && (
                    <button
                        onClick={e => { e.stopPropagation(); onDateSelect(null); }}
                        className="sw-clear-btn"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="sw-popup sw-calendar-popup">
                    <div className="sw-cal-header">
                        <button
                            onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); }}
                            className="sw-cal-nav-btn"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <div className="sw-cal-title">{MONTH_NAMES[currentMonth.getMonth()]}</div>
                            <div className="sw-cal-subtitle">{currentMonth.getFullYear()}</div>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); }}
                            className="sw-cal-nav-btn"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="sw-cal-grid">
                        {DAY_LABELS.map(d => (
                            <div key={d} className="sw-cal-day-label">{d}</div>
                        ))}
                    </div>

                    <div className="sw-cal-grid">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            let btnClass = "sw-day-btn";
                            if (isSelected(day)) btnClass += " is-selected";
                            else if (focusedDay === day) btnClass += " is-focused";
                            else if (isToday(day)) btnClass += " is-today";

                            return (
                                <button
                                    key={day}
                                    onClick={() => selectDay(day)}
                                    onMouseEnter={() => setFocusedDay(day)}
                                    className={btnClass}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="sw-cal-footer">
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                                    className="sw-quick-date-btn"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {selectedDate && (
                            <button
                                onClick={e => { e.stopPropagation(); onDateSelect(null); setIsOpen(false); }}
                                style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--sw-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
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


// ─── Search Widget (Improved Solid UX) ───────────────────────────────────────────────
type SegmentKey = 'destination' | 'dates' | 'state';

const SearchWidget = ({
    onSearch,
    config = { showDestination: true, showDates: false, showState: true, showSearchButton: true },
    initialTerm = '',
    initialState = '',
}: {
    onSearch?: (query: { term: string; state: string }) => void;
    config?: SearchConfig;
    initialTerm?: string;
    initialState?: string;
}) => {
    const [searchValue, setSearchValue] = useState(initialTerm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [stateValue, setStateValue] = useState(initialState);
    const [focusedSegment, setFocusedSegment] = useState<SegmentKey | null>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const latestStateRef = useRef(stateValue);

    const hasFilters = searchValue.trim() !== '' || stateValue !== '';

    useOutsideClick(containerRef, () => {
        setFocusedSegment(null);
    });

    useEffect(() => {
        latestStateRef.current = stateValue;
    }, [stateValue]);

    const activeSegments = useMemo<SegmentKey[]>(() => {
        const segs: SegmentKey[] = [];
        if (config.showDestination) segs.push('destination');
        if (config.showDates) segs.push('dates');
        if (config.showState) segs.push('state');
        return segs;
    }, [config]);

    const goToNextSegment = useCallback((current: SegmentKey) => {
        const idx = activeSegments.indexOf(current);
        if (idx < activeSegments.length - 1) {
            setFocusedSegment(activeSegments[idx + 1]);
        } else {
            setFocusedSegment(null);
            onSearch?.({ term: searchValue, state: stateValue });
        }
    }, [activeSegments, searchValue, stateValue, onSearch]);
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            onSearch?.({ term: searchValue, state: stateValue });
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchValue, stateValue]);
    const handleDestinationChange = (value: string) => {
        setSearchValue(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch?.({ term: value, state: latestStateRef.current });
        }, 400);
    };

    const handleDestinationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (debounceRef.current) clearTimeout(debounceRef.current);
            goToNextSegment('destination');
        }
    };

    const handleStateChange = (state: string) => {
        setStateValue(state);
        onSearch?.({ term: searchValue, state });
    };

    const handleSearch = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch?.({ term: searchValue, state: stateValue });
    };

    const clearAll = () => {
        setSearchValue('');
        setStateValue('');
        onSearch?.({ term: '', state: '' });
    };

    if (!config.showDestination && !config.showDates && !config.showState && !config.showSearchButton) return null;

    return (
        <div className="sw-container" ref={containerRef}>
            {/* Main Solid Bar */}
            <div className={`sw-main-bar ${focusedSegment ? 'is-focused' : ''}`}>
                <div className="sw-segments-wrapper">

                    {/* 1. Destination */}
                    {config.showDestination && (
                        <div
                            className={`sw-segment ${focusedSegment === 'destination' ? 'is-active' : ''}`}
                            onClick={() => { destinationRef.current?.focus(); setFocusedSegment('destination'); }}
                        >
                            <label className="sw-segment-label">
                                <Search size={9} strokeWidth={3} /> Where to
                            </label>
                            <div className="sw-input-row">
                                <input
                                    ref={destinationRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={e => handleDestinationChange(e.target.value)}
                                    onKeyDown={handleDestinationKeyDown}
                                    onFocus={() => setFocusedSegment('destination')}
                                    onBlur={() => setTimeout(() => setFocusedSegment(null), 150)}
                                    placeholder="Search destinations..."
                                    className="sw-input"
                                />
                                {searchValue && (
                                    <button
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={() => {
                                            setSearchValue('');
                                            onSearch?.({ term: '', state: stateValue });
                                            destinationRef.current?.focus();
                                        }}
                                        className="sw-clear-btn"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Divider pill */}
                    {config.showDestination && config.showState && <div className="sw-divider" />}

                    {/* 2. Dates */}
                    {config.showDates && (
                        <div className={`sw-segment ${focusedSegment === 'dates' ? 'is-active' : ''}`}>
                            <label className="sw-segment-label">
                                <Calendar size={9} strokeWidth={3} /> When
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

                    {config.showDates && config.showState && <div className="sw-divider" />}

                    {/* 3. State / Region */}
                    {config.showState && (
                        <div className={`sw-segment ${focusedSegment === 'state' ? 'is-active' : ''}`}>
                            <label className="sw-segment-label">
                                <MapPin size={9} strokeWidth={3} /> State
                            </label>
                            <CustomDropdown
                                value={stateValue}
                                onChange={handleStateChange}
                                options={indianStates}
                                placeholder="All states"
                                isFocused={focusedSegment === 'state'}
                                onFocus={() => setFocusedSegment('state')}
                                onEnterKey={() => goToNextSegment('state')}
                            />
                        </div>
                    )}
                </div>

                {/* Right side: Clear filters + Search button */}
                <div className="sw-actions">
                    {hasFilters && (
                        <button onClick={clearAll} className="sw-clear-btn" title="Clear filters" style={{ padding: '0.625rem' }}>
                            <X size={16} />
                        </button>
                    )}

                    {config.showSearchButton && (
                        <button onClick={handleSearch} className="sw-search-btn">
                            <Search size={15} strokeWidth={2.5} />
                            <span>Search</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Active filter pills */}
            {hasFilters && (
                <div className="sw-pills-container">
                    {searchValue && (
                        <span className="sw-pill">
                            <Search size={10} className="sw-pill-icon" />
                            {searchValue}
                            <button
                                onClick={() => { setSearchValue(''); onSearch?.({ term: '', state: stateValue }); }}
                                className="sw-clear-btn"
                            >
                                <X size={10} />
                            </button>
                        </span>
                    )}
                    {stateValue && (
                        <span className="sw-pill">
                            <MapPin size={10} className="sw-pill-icon" />
                            {stateValue}
                            <button
                                onClick={() => handleStateChange('')}
                                className="sw-clear-btn"
                            >
                                <X size={10} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchWidget;