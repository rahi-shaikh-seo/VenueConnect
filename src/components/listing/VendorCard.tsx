import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Briefcase, Tag } from 'lucide-react';

export interface VendorCardProps {
  name: string;
  slug: string;
  city: string;
  area: string;
  images: string[];
  price_range: string;
  experience_years?: number;
  category?: string;
  specialities?: string[];
  avg_rating?: number;
  review_count?: number;
  is_verified?: boolean;
}

const PRICE_LABELS: Record<string, { label: string; color: string }> = {
  budget:  { label: 'Budget',    color: 'bg-emerald-100 text-emerald-700' },
  mid:     { label: 'Mid-range', color: 'bg-sky-100 text-sky-700' },
  premium: { label: 'Premium',   color: 'bg-violet-100 text-violet-700' },
  luxury:  { label: 'Luxury',    color: 'bg-amber-100 text-amber-700' },
};

export function VendorCard({
  name, slug, city, area, images, price_range,
  experience_years, category, specialities,
  avg_rating, review_count, is_verified,
}: VendorCardProps) {
  const coverImage = images?.[0];
  const price = PRICE_LABELS[price_range] ?? { label: price_range, color: 'bg-gray-100 text-gray-600' };
  const rating = avg_rating ?? 0;
  const reviews = review_count ?? 0;
  const tags = (specialities ?? []).slice(0, 3); // show max 3 tags

  return (
    <Link
      href={`/vendors/${slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-rose-100 to-orange-100 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl opacity-20">📸</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {is_verified && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            ✓ Verified
          </span>
        )}

        <span className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${price.color}`}>
          {price.label}
        </span>

        {experience_years != null && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            <Briefcase size={11} />
            {experience_years} yr{experience_years !== 1 ? 's' : ''} exp.
          </span>
        )}

        {category && (
          <span className="absolute bottom-3 right-3 bg-white/90 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1.5">
          <MapPin size={11} className="flex-shrink-0 text-rose-400" />
          <span className="line-clamp-1">{area}, {city}</span>
        </div>

        {/* Speciality tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-medium bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {rating > 0 ? (
            <>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({reviews})</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">No reviews yet</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100 mt-3">
          <span className="text-xs text-gray-400">Get a quote</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:gap-2 transition-all">
            View Profile <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Skeleton loading state */
export function VendorCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-8 bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}
