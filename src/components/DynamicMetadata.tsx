import Head from 'next/head';

interface DynamicMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsDirectives?: string;
  schemaOrg?: string;
}

export default function DynamicMetadata({
  title = 'Grow to Prime - AI Content Generation',
  description = 'Transform your business with AI-powered content generation',
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  robotsDirectives = 'index, follow',
  schemaOrg
}: DynamicMetadataProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsDirectives} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content={ogType} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Schema.org */}
      {(() => {
        if (!schemaOrg) return null;
        try {
          const parsed = typeof schemaOrg === 'string' ? JSON.parse(schemaOrg) : schemaOrg;
          const payload = Array.isArray(parsed) ? parsed : [parsed];
          return payload.map((item, idx) => (
            <script
              key={idx}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
            />
          ));
        } catch {
          return null;
        }
      })()}
    </Head>
  );
}