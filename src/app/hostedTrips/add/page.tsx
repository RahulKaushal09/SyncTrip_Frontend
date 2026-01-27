'use client';

import { useState } from 'react';
import apiClient from '@/utils/apiClient';
import toast from 'react-hot-toast';

type ImageMode = 'url' | 'file';

type ItineraryDay = {
    id: string;
    date: string;
    title: string;
    descriptionHtml: string;
};

export default function CreateHostedTripPage() {
    const [loading, setLoading] = useState(false);
    const [imageMode, setImageMode] = useState<ImageMode>('url');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        locationId: '',
        locationName: '',
        price: '',
        capacity: '',
        mainImageUrl: '',
        startDate: '',
        endDate: ''
    });

    const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
        {
            id: crypto.randomUUID(),
            date: '',
            title: '',
            descriptionHtml: ''
        }
    ]);

    /* ------------------ helpers ------------------ */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        if (e.target.name === 'mainImageUrl') {
            setPreview(e.target.value || null);
        }
    };

    const handleFileChange = (file?: File) => {
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const addDay = () => {
        setItineraryDays(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                date: '',
                title: '',
                descriptionHtml: ''
            }
        ]);
    };

    const removeDay = (id: string) => {
        setItineraryDays(prev => prev.filter(d => d.id !== id));
    };

    const updateDay = (
        id: string,
        field: keyof ItineraryDay,
        value: string
    ) => {
        setItineraryDays(prev =>
            prev.map(day =>
                day.id === id ? { ...day, [field]: value } : day
            )
        );
    };

    /* ------------------ submit ------------------ */

    const submit = async () => {
        if (!form.title || !form.locationId || !form.startDate || !form.endDate) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);

            const fd = new FormData();

            fd.append('title', form.title);
            fd.append('slug', form.slug || form.title.toLowerCase().replace(/\s+/g, '-'));
            fd.append('locationId', form.locationId);
            fd.append('locationName', form.locationName);
            fd.append('price', form.price);
            fd.append('capacity', form.capacity);

            fd.append('dates[0][startDate]', form.startDate);
            fd.append('dates[0][endDate]', form.endDate);
            fd.append('dates[0][availableSeats]', form.capacity);

            fd.append('status', 'published');
            fd.append('isJoinable', 'true');
            if (imageMode === 'file') {
    if (!imageFile) {
        toast.error('Please select an image file');
        return;
    }
    fd.append('imageFile', imageFile, imageFile.name);
}

            if (imageMode === 'url' && form.mainImageUrl) {
                fd.append('mainImageUrl', form.mainImageUrl);
            }

            itineraryDays.forEach((day, index) => {
                fd.append(`itineraryTemplate[days][${index}][title]`, day.title);
                fd.append(
                    `itineraryTemplate[days][${index}][descriptionHtml]`,
                    day.descriptionHtml
                );
            });

            await apiClient.post('/hostedTrips', fd);

            toast.success('Hosted trip created successfully');
        } 
        catch (err: Error | unknown) {
            console.error('Error creating hosted trip:', err);
            toast.error( 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ UI ------------------ */

    return (
        <div className="create-hosted-trip">
            <h2>Create Hosted Trip</h2>

            <input name="title" placeholder="Trip Title *" onChange={handleChange} />
            <input name="slug" placeholder="Slug" onChange={handleChange} />
            <input name="locationId" placeholder="Location ID *" onChange={handleChange} />
            <input name="locationName" placeholder="Location Name" onChange={handleChange} />

            {/* IMAGE MODE */}
            <div className="image-toggle">
                <label>
                    <input
                        type="radio"
                        checked={imageMode === 'url'}
                        onChange={() => {
                            setImageMode('url');
                            setImageFile(null);
                            setPreview(form.mainImageUrl || null);
                        }}
                    />
                    Image URL
                </label>

                <label>
                    <input
                        type="radio"
                        checked={imageMode === 'file'}
                        onChange={() => {
                            setImageMode('file');
                            setForm(prev => ({ ...prev, mainImageUrl: '' }));
                            setPreview(null);
                        }}
                    />
                    Upload Image
                </label>
            </div>

            {imageMode === 'url' && (
                <input
                    name="mainImageUrl"
                    placeholder="Image URL"
                    onChange={handleChange}
                />
            )}

            {imageMode === 'file' && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
            )}

            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Preview" />
                </div>
            )}

            <input type="number" name="price" placeholder="Price (₹)" onChange={handleChange} />
            <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} />

            <div className="date-row">
                <input type="date" name="startDate" onChange={handleChange} />
                <input type="date" name="endDate" onChange={handleChange} />
            </div>

            {/* ================= ITINERARY ================= */}

            <div className="itinerary-block">
                <h3>Trip Itinerary</h3>

                {itineraryDays.map((day, index) => (
                    <div key={day.id} className="itinerary-day">
                        <div className="itinerary-header">
                            <h4>Day {index + 1}</h4>

                            {itineraryDays.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-day"
                                    onClick={() => removeDay(day.id)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <input
                            type="date"
                            value={day.date}
                            onChange={(e) =>
                                updateDay(day.id, 'date', e.target.value)
                            }
                        />

                        <input
                            placeholder="Day title"
                            value={day.title}
                            onChange={(e) =>
                                updateDay(day.id, 'title', e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Day description (HTML allowed)"
                            value={day.descriptionHtml}
                            onChange={(e) =>
                                updateDay(day.id, 'descriptionHtml', e.target.value)
                            }
                        />
                    </div>
                ))}

                <button type="button" className="add-day" onClick={addDay}>
                    + Add Another Day
                </button>
            </div>

            <button disabled={loading} onClick={submit}>
                {loading ? 'Creating...' : 'Create Trip'}
            </button>

            {/* ================= STYLES ================= */}

            <style jsx>{`
                .create-hosted-trip {
                    max-width: 650px;
                    margin: 50px auto;
                    padding: 30px;
                    background: #fff;
                    border-radius: 14px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                }

                input, textarea {
                    width: 100%;
                    margin-bottom: 14px;
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid #e4e8ee;
                }

                textarea {
                    min-height: 100px;
                }

                .date-row {
                    display: flex;
                    gap: 12px;
                }

                .image-toggle {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 12px;
                }

                .image-preview img {
                    width: 100%;
                    max-height: 220px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 12px;
                }

                .itinerary-block {
                    margin-top: 30px;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }

                .itinerary-day {
                    background: #f9fbfd;
                    border: 1px solid #e6ecf2;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                }

                .itinerary-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .remove-day {
                    background: none;
                    border: none;
                    color: #e53935;
                    cursor: pointer;
                }

                .add-day {
                    width: 100%;
                    height: 44px;
                    border: 2px dashed #3abef5;
                    background: transparent;
                    color: #3abef5;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                button {
                    width: 100%;
                    height: 46px;
                    margin-top: 20px;
                    background: linear-gradient(135deg,#3abef5,#2196f3);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
