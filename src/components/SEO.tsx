import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
}

const SEO = ({ 
  title, 
  description = "VenueConnect Gujarat – Find the perfect wedding venues, banquet halls, farmhouses, and event spaces across Ahmedabad, Surat, Rajkot, Vadodara and more. Gujarat's #1 venue discovery platform.", 
  canonical,
  ogType = "website",
  ogImage = "/og-image.jpg"
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = "https://venueconnect.in"; // Replace with actual domain when ready
  const currentUrl = `${siteUrl}${location.pathname}${location.search}`;
  const finalCanonical = canonical || currentUrl;

  useEffect(() => {
    // Set Document Title
    document.title = title.includes("VenueConnect") ? title : `${title} | VenueConnect Gujarat`;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute("href", finalCanonical);
    } else {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      linkCanonical.setAttribute("href", finalCanonical);
      document.head.appendChild(linkCanonical);
    }

    // Update OG Tags
    const ogTags = {
      "og:title": title,
      "og:description": description,
      "og:url": finalCanonical,
      "og:type": ogType,
      "og:image": ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    });

    // Update Twitter Tags
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    });

  }, [title, description, finalCanonical, ogType, ogImage]);

  return null;
};

export default SEO;
