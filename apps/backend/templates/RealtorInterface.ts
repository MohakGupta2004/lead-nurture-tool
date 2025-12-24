export interface Realtor {
  clerkUserId: string;
  firstName: string;
  lastName: string;

  brokerageName?: string | null;
  professionalEmail?: string | null;
  phNo?: string | null;

  yearsInBusiness?: number | null;
  markets?: string[] | null;

  profileImageUrl?: string | null;
  realtorType?: 'Individual' | 'Agency' | null;

  calendlyLink?: string | null;
  signatureImageUrl?: string | null;
  brandLogoUrl?: string | null;
  brokerageLogoUrl?: string | null;
}