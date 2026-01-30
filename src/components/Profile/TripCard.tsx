// // --- Unified Trip Card Component ---
// const TripCard = ({ trip, isOwner, onClick }: { trip: UserTrip, isOwner: boolean, onClick: () => void }) => {
//     const privacyLabel = trip.privacy?.toLowerCase().includes('public') ? 'Public' : 'Private';
//     const isPublic = privacyLabel === 'Public';
//     const currentYear = new Date().getFullYear();
//     const tripYear = new Date(trip.startDate).getFullYear();
//     const showYear = tripYear !== currentYear;

//     return (
//         <div
//             onClick={isOwner ? onClick : () => { }}
//             className="aspect-[4/3] rounded-2xl overflow-hidden relative group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md"
//         >
//             <img
//                 src={trip.image}
//                 alt={trip.tripName}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
//                 loading="lazy"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
//             {isOwner && (
//                 <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
//                     <div className="bg-white/20 backdrop-blur-md border border-white/40 p-3.5 rounded-full text-white shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                         <SquarePen size={32} strokeWidth={2} />
//                     </div>
//                 </div>
//             )}
//             <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
//                 {trip.budget && (
//                     <span className="bg-white/90 backdrop-blur-md text-[var(--secondary-1)] text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
//                         {trip.budget}
//                     </span>
//                 )}
//                 {trip.source?.type === 'hosted' && (
//                     <span className="bg-[var(--primary-hover)]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
//                         <Briefcase size={10} /> Hosted
//                     </span>
//                 )}
//             </div>
//             {isOwner && (
//                 <div className="absolute top-3 right-3 z-20">
//                     <span className={`backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 bg-[var(--secondary-1)] bg-opacity-80`}>
//                         {isPublic ? <Globe size={10} /> : <Lock size={10} />}
//                         {privacyLabel}
//                     </span>
//                 </div>
//             )}
//             <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
//                 <h3 className="font-bold text-white text-2xl leading-tight drop-shadow-md mb-1.5 line-clamp-2">
//                     {trip.tripName || trip.locationName}
//                 </h3>
//                 <div className="flex flex-col gap-1">
//                     <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
//                         <Calendar size={12} className="text-white/80" />
//                         <span>
//                             {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                             &mdash;
//                             {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                             {showYear && `, ${tripYear}`}
//                         </span>
//                     </div>
//                     {trip.locationName && trip.tripName && (
//                         <div className="flex items-center gap-2 text-white/80 text-xs">
//                             <MapPin size={12} />
//                             <span className="truncate">{trip.locationName}</span>
//                         </div>
//                     )}
//                     <div className="flex items-center gap-2 text-white/80 text-xs">
//                         <MapPinned size={12} />
//                         <span className="truncate">{trip.activitiesCount as number > 0 ? trip.activitiesCount : "No"} activities planned</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };