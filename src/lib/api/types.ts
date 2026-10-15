/** Tipos públicos que reflejan los DTOs expuestos por koffisoft_api. */

export interface PublicMenuAllergen {
  id: string;
  code: string;
  nameEs: string;
  nameEn: string;
  presenceType: string;
}

export interface PublicMenuModifier {
  id: string;
  nameEs: string;
  nameEn: string;
  priceDelta: string;
}

export interface PublicMenuModifierGroup {
  id: string;
  nameEs: string;
  nameEn: string;
  selectionMin: number;
  selectionMax: number;
  required: boolean;
  modifiers: PublicMenuModifier[];
}

export interface PublicMenuPrice {
  id: string;
  amount: string;
  currency: string;
  includesTax: boolean;
}

export interface PublicMenuVariant {
  id: string;
  nameEs: string;
  nameEn: string;
  isDefault: boolean;
  available: boolean;
  price: PublicMenuPrice;
  allergens: PublicMenuAllergen[];
  modifierGroups: PublicMenuModifierGroup[];
}

export interface PublicMenuItem {
  id: string;
  slug: string;
  /** Campo opcional reservado para una futura URL de media del contrato público. */
  imageUrl?: string;
  itemType: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  variants: PublicMenuVariant[];
}

export interface PublicMenuCategory {
  id: string;
  slug: string;
  /** Campo opcional de presentación; no sustituye el contenido canónico de la API. */
  imageUrl?: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  items: PublicMenuItem[];
}

export interface PublicMenuResponse {
  locationId: string;
  channel: string;
  generatedAt: string;
  categories: PublicMenuCategory[];
}

export interface PublicMenuDetailResponse {
  category: Omit<PublicMenuCategory, 'items'>;
  item: PublicMenuItem;
}

export interface PublicAvailabilitySpace {
  id: string;
  code: string;
  nameEs: string;
  nameEn: string;
  seatedCapacity: number;
  standingCapacity: number | null;
  available: boolean;
}

export interface PublicAvailabilityResponse {
  locationId: string;
  timezone: string;
  startsAt: string;
  endsAt: string;
  spaces: PublicAvailabilitySpace[];
}

export interface PublicReservationResponse {
  reservationCode: string;
  status: string;
  startsAt: string;
  endsAt: string;
  partySize: number;
}

export interface PublicEventSpace {
  id: string;
  code: string;
  nameEs: string;
  nameEn: string;
  spaceType: string;
  seatedCapacity: number;
  standingCapacity: number | null;
}

export interface PublicEventPackage {
  id: string;
  packageCode: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  pricingModel: string;
  minGuestCount: number | null;
  maxGuestCount: number | null;
}

export interface PublicEventCatalogResponse {
  locationId: string;
  spaces: PublicEventSpace[];
  packages: PublicEventPackage[];
}

export interface PublicEventRequestResponse {
  eventCode: string;
  status: string;
  startsAt: string;
  endsAt: string;
}

export interface PublicImportantAnnouncement {
  id: string;
  locationId: string;
  title: string;
  message: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSiteHour {
  id: string;
  serviceType: string;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  crossesMidnight: boolean;
  active: boolean;
}

export interface PublicSiteOverride {
  id: string;
  serviceDate: string;
  serviceType: string;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
  reason: string;
}

export interface PublicSiteProfile {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string | null;
  aboutTitle: string;
  aboutDescription: string;
  aboutMission: string;
  aboutVision: string;
  aboutTeam: { name: string; role: string; description: string }[];
  socialFacebookUrl: string | null;
  socialInstagramUrl: string | null;
  socialTikTokUrl: string | null;
}

export interface PublicSiteContent {
  locationId: string;
  location: {
    name: string;
    addressLine: string;
    municipality: string;
    department: string;
    phone: string | null;
    email: string | null;
    timezone: string;
  };
  hours: PublicSiteHour[];
  overrides: PublicSiteOverride[];
  profile: PublicSiteProfile | null;
}

export interface PublicMenuQuery {
  category?: string;
  allergen?: string;
}

export interface ReservationAvailabilityRequest {
  date: string;
  time: string;
  partySize: number;
  durationMinutes?: number;
  spaceId?: string;
}

export interface CreateReservationRequest extends ReservationAvailabilityRequest {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  preferredLanguage?: 'es' | 'en';
  preferredSpaceId?: string;
  specialRequests?: string;
}

export type PublicEventType =
  'Wedding' | 'Birthday' | 'Corporate' | 'Meeting' | 'Anniversary' | 'Other';

export interface CreateEventRequest {
  eventType: PublicEventType;
  title: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  preferredLanguage?: 'es' | 'en';
  startsAt: string;
  endsAt: string;
  setupStartsAt?: string;
  estimatedGuestCount: number;
  budgetTarget?: string;
  specialRequirements?: string;
}
