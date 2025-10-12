'use client';
import React, { useState, useEffect } from 'react';
import { Heart } from "lucide-react";

import toast from 'react-hot-toast';
import { ApiService } from '@/utils/api.utils';
import { STORAGE_KEYS } from '@/constants';
import { triggerLogin } from '@/utils';

interface HeartIconProps {
  id: string;
  parentId?: string;
  parentType?: string;
  name?: string;
  type: string;
  isWishlisted: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  id,
  parentId,
  parentType,
  name,
  type,
  isWishlisted,
}) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWishlistedState, setIsWishlistedState] = useState(isWishlisted);

  // Update internal state when prop changes (after wishlist data loads)
  useEffect(() => {
    setIsWishlistedState(isWishlisted);
  }, [isWishlisted]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token === null) {
      toast.error('Please log in to manage your wishlist');
      triggerLogin(() => handleClick(e));
      return;
    }
    try {
      const res = await ApiService.toggleWishlist({
        type,
        refId: id,
        parentType,
        parentId,
        name,
      });

      if (res?.message) {
        toast.success(res.message);
        setIsWishlistedState(!isWishlistedState);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div
    //   style={{
    //     position: 'absolute',
    //     top: '10px',
    //     right: '10px',
    //     background: 'white',
    //     borderRadius: '50%',
    //     padding: '8px',
    //     cursor: loading ? 'not-allowed' : 'pointer',
    //     opacity: loading ? 0.5 : 1,
    //   }}
    //   onClick={handleClick}
    //   onMouseEnter={() => setHovered(true)}
    //   onMouseLeave={() => setHovered(false)}
    // >
    <Heart
  size={25}
  className={`heart-icon`}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onClick={handleClick}
  role="button"
  aria-pressed={isWishlistedState}
  tabIndex={0}
  // onKeyDown={(e) => {
  //   if (e.key === "Enter" || e.key === " ") {
  //     handleClick(e as any);
  //   }
  // }}
  style={{
    
      
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.5 : 1,
    transition: "fill 0.3s ease",
    stroke: !hovered ? "white" : "#6ECAD5",  
    strokeWidth: isWishlistedState ?0:1,
    fill: isWishlistedState || hovered ? "#6ECAD5" : "none",
    width: 25,
    height: 25,
  }}
/>
    // <Heart
    //   className={`heart-icon ${isWishlistedState ? 'active' : ''}`}
    //   size={25}
    //   onMouseEnter={() => setHovered(true)}
    //   onMouseLeave={() => setHovered(false)}
    //   onClick={handleClick}
    //   style={{
    //     fill: hovered ? "#6ECAD5" : "transparent",  // fill on hover only
    //     stroke: !hovered ? "white" : "#6ECAD5",                            // white border always
    //     strokeWidth: 20,                            // thickness of the white border
    //     transition: "fill 0.3s ease",
    //     cursor: loading ? "not-allowed" : "pointer",
    //     width: "30px",
    //     height: "20px",
    //     opacity: loading ? 0.5 : 1
    //   }}
    // />
    // </div>
  );
};

export default HeartIcon;
