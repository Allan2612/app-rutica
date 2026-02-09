export interface EventPostProps {
  eventId: string;
  name: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  isFree?: boolean;
  price?: number | null;
  currency?: string | null;
  capacity?: number | null;
  categoryNames?: string[];
  categoryIds?: string[];
  locationLabel?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  imageUrls?: string[];
  authorName?: string | null;
  authorAvatarUrl?: string | null;
  isApproved?: boolean;
  createdAt?: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  socialLinks?: Record<string, string> | null;
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
}
