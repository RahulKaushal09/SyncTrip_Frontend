import GroupPreviewPage from '@/components/Trips/GroupPreviewClient';
import { CookieUtils } from '@/utils/cookie.utils';
import { GroupApiServices } from '@/utils/group/group.api';
import { GroupCard } from '@/utils/group/group.types';
import { Metadata } from 'next';

type SeoData = {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
};

type JsonLd = {
  "@context": string;
  "@graph": Array<Record<string, unknown>>;
};

const getGroupIdFromGroupSlug = (slug: string): string => {
  const parts = slug.split('_');
  return parts[parts.length - 1];
};

function buildJsonLd(
  res: GroupCard,
  seo: SeoData,
  slug: string
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SyncTrip",
        url: "https://synctrip.in",
        logo: "https://synctrip.in/logo_main_withoutBG.png",
        foundingDate: "2025",
        description:
          "A collaborative travel planning platform allowing groups to synchronize itineraries in real-time",
      },
      {
        "@type": "TouristTrip",
        name: seo.seo_title || res.groupName,
        description: seo.seo_description || res.description,
        image: res.groupImageUrl,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${slug}`,
        location: {
          "@type": "Place",
          name: res.locationName,
        },
      },
    ],
  };
}

async function getGroupData(groupId: string): Promise<GroupCard> {
  const userToken = await CookieUtils.get("userToken");
  return GroupApiServices.getGroupPreview(groupId, userToken as string);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params;
  const groupId = getGroupIdFromGroupSlug(slug);

  const res = await getGroupData(groupId);
  const seo = res?.seo || {};

  return {
    title: seo.seo_title || res.groupName,
    description: seo.seo_description || res.description,
    keywords: seo.seo_keywords || res.tags?.join(', '),
    openGraph: {
      title: seo.seo_title || res.groupName,
      description: seo.seo_description || res.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${slug}`,
      images: res.groupImageUrl
        ? [
            {
              url: res.groupImageUrl,
              alt: res.groupName,
            },
          ]
        : undefined,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${slug}`,
    },
  };
}

const GroupPreview = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {

  const { slug } = await params;
  const groupId = getGroupIdFromGroupSlug(slug);

  const res = await getGroupData(groupId);
  const seo = res?.seo || {};
  const jsonLd = buildJsonLd(res, seo, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <GroupPreviewPage group={res} />
    </>
  );
};

export default GroupPreview;