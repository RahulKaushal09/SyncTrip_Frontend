'use client';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import dynamic from 'next/dynamic';
const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), { ssr: false });

// import FroalaEditor from 'react-froala-wysiwyg';
import { ApiService } from '@/utils';
import { LocationFields } from '@/constants';
import { BlogPost, Location } from '@/types';
import { BlogsApiServices } from '@/utils';
import { addBlogRequestSchema } from '@/classes/ApiRequest.classes';

const stripFroalaCredit = (html) => {
  if (!html) return html;
  return html.replace(
    /<p[^>]*data-f-id="pbf"[^>]*>[\s\S]*?<\/p>/gi,
    ''
  );
};
export default function AddBlogPage() {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    featuredImage: '',
    relatedLocations: [],
    seo: {
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
      canonical_url: '',
      seo_image: '',
    },
    featured: false,
    author: '',
    readTime: '',
    rating: '',
    id: '',
    createdAt: '',
    tags: [],
    category: '',
    filterTags: [],
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const fieldsToFetchForHome = [LocationFields.TITLE, LocationFields.ID];

  useEffect(() => {
    const fetchLocations = async () => {
      try {

        const response = await ApiService.fetchLocations(0, 1000, fieldsToFetchForHome);
        setLocations(response.locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    void fetchLocations();
  }, []);

  // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, type, value } = e.target;
  //   const checked = (e.target as HTMLInputElement).checked;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value,
  //     ...(name.includes('seo_') && {
  //       seo: {
  //         ...prev.seo,
  //         [name.replace('seo_', '')]: value,
  //       },
  //     }),
  //   }));
  // };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // console.log(`Handling change: ${name} = ${value}`); // Debugging

    setFormData((prev) => {
      if (name.includes('seo_') || name === 'canonical_url') {
        const seoField = name; // Keep the full name (e.g., 'seo_title')
        // console.log(`Updating SEO field: ${seoField} = ${value}`); // Debugging
        return {
          ...prev,
          seo: {
            ...prev.seo,
            [seoField]: value, // Update the correct field (e.g., 'seo_title')
          },
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map((keyword) => keyword.trim());
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        seo_keywords: keywords,
      },
    }));
  };

  const filteredLocations = locations.filter((dest) =>
    dest.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDestinationSelect = (destId: string) => {
    setSelectedLocationIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const selectedTitles = locations
    .filter((loc) => selectedLocationIds.includes(loc.id))
    .map((loc) => loc.title);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const payload: BlogPost = {
  //       ...formData,
  //       relatedLocations: selectedLocationIds,
  //       seo: {
  //         ...formData.seo,
  //         seo_image: formData.featuredImage,
  //       },
  //     };

  //     const createdBlog = await BlogsApiServices.createNewBlog(payload);

  //     if (createdBlog) {
  //       setFormData({
  //         title: '',
  //         slug: '',
  //         content: '',
  //         featuredImage: '',
  //         relatedLocations: [],
  //         seo: {
  //           seo_title: '',
  //           seo_description: '',
  //           seo_keywords: [],
  //           canonical_url: '',
  //           seo_image: '',
  //         },
  //         featured: false,
  //         author: '',
  //         readTime: '',
  //         rating: '',
  //         id: '',
  //         createdAt: '',
  //         tags: [],
  //         category: '',
  //       });
  //       setSelectedLocationIds([]);
  //       alert('Blog created successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Error creating blog:', error);
  //     alert('Failed to create blog.');
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const cleanedContent = stripFroalaCredit(formData.content);
      const payload: addBlogRequestSchema = {
        title: formData.title,
        slug: formData.slug,
        content: cleanedContent,
        featuredImage: formData.featuredImage,
        relatedLocations: selectedLocationIds,
        seo: {
          ...formData.seo,
          seo_image: formData.featuredImage,
        },
        author: formData.author,
        readTime: formData.readTime,
        // category: formData.category,
        rating: formData.rating,
        featured: formData.featured,
      };

      const createdBlog = await BlogsApiServices.createNewBlog(payload);

      if (createdBlog) {
        // setFormData({
        //   title: '',
        //   slug: '',
        //   content: '',
        //   featuredImage: '',
        //   relatedLocations: [],
        //   seo: {
        //     seo_title: '',
        //     seo_description: '',
        //     seo_keywords: [],
        //     canonical_url: '',
        //     seo_image: '',
        //   },
        //   featured: false,
        //   author: '',
        //   readTime: '',
        //   rating: '',
        //   id: '',
        //   createdAt: '',
        //   tags: [],
        //   category: '',
        // });
        // setSelectedLocationIds([]);
        alert('Blog created successfully!');
      }
    } catch (error: unknown) {
      console.error('Error creating blog:', error);
      const errorMessage = (error as Error).message === 'Slug already exists'
        ? 'The slug is already in use. Please choose a different one.'
        : 'Failed to create blog. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug (e.g. trip-to-manali)"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <FroalaEditor
          model={formData.content}
          onModelChange={(content) => {
            const cleaned = stripFroalaCredit(content);
            setFormData((prev) => ({ ...prev, content: cleaned }));
          }}
          // onModelChange={(content: string) => setFormData((prev) => ({ ...prev, content }))}
          config={{
            placeholderText: 'Write your blog content here...',
            charCounterCount: true,
            toolbarSticky: true,
            heightMin: 300,
            pluginsEnabled: ['align', 'codeBeautifier', 'codeView', 'image', 'link', 'lists'],
            toolbarButtons: [
              ['bold', 'italic', 'underline', 'strikeThrough'],
              ['formatOL', 'formatUL'],
              ['insertLink', 'insertImage'],
              ['html'],
            ],
          }}
        />

        <input
          type="text"
          name="featuredImage"
          placeholder="Featured Image URL"
          value={formData.featuredImage}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="full-profile-section">
          <label htmlFor="location-search" className="block mb-2">Location connected with:</label>
          <div className="full-profile-dropdown-container">
            <input
              id="location-search"
              type="text"
              className="full-profile-input full-profile-search w-full border p-2 rounded"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            />
            {isDropdownOpen && (
              <div className="full-profile-dropdown border rounded mt-1 max-h-60 overflow-y-auto">
                {filteredLocations.length > 0 ? (
                  filteredLocations
                    .filter((dest) => !selectedLocationIds.includes(dest.id))
                    .map((dest) => (
                      <div
                        key={dest.id}
                        className="full-profile-dropdown-item cursor-pointer p-2 hover:bg-gray-100"
                        onMouseDown={() => handleDestinationSelect(dest.id)}
                        role="button"
                        tabIndex={0}
                      >
                        {dest.title?.replace(/[0-9.]/g, '')}
                      </div>
                    ))
                ) : (
                  <div className="full-profile-dropdown-item p-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
            <div className="full-profile-selected-destinations mt-2 flex flex-wrap gap-2">
              {selectedTitles.map((title, idx) => (
                <span key={idx} className="full-profile-selected-tag bg-gray-200 px-2 py-1 rounded flex items-center">
                  {title?.replace(/[0-9.]/g, '')}
                  <button
                    type="button"
                    className="full-profile-remove-tag ml-2 text-red-500"
                    onClick={() => {
                      const loc = locations.find((l) => l.title === title);
                      if (loc) {
                        setSelectedLocationIds((prev) => prev.filter((id) => id !== loc.id));
                      }
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="readTime"
          placeholder="Read Time (in minutes)"
          value={formData.readTime}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5)"
          value={formData.rating}
          min="0"
          max="5"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <h2 className="text-xl font-semibold mt-6">SEO Information</h2>
        <input
          type="text"
          name="seo_title"
          placeholder="SEO Title"
          value={formData.seo.seo_title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="seo_description"
          placeholder="SEO Description"
          value={formData.seo.seo_description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="seo_keywords"
          placeholder="SEO Keywords (comma-separated)"
          value={formData.seo.seo_keywords.join(', ')}
          onChange={handleKeywordsChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="canonical_url"
          placeholder="Canonical URL"
          value={formData.seo.canonical_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span>Mark as Featured</span>
        </label>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Publish Blog
        </button>
      </form>
    </div>
  );
}