import { citiesData } from "./citiesData";
import { formatSlug as formatTitle } from "./seoConstants";

export { formatTitle };

export interface SEOData {
    title: string;
    description: string;
    h1: string;
    heroSubtitle: string;
    content: string;
    faqSchema: string;
    cityImage?: string;
    breadcrumbs: { name: string, item: string }[];
}

export const generateSEOContent = (
    baseUrl: string,
    citySlug: string,
    categorySlug?: string,
    localitySlug?: string,
    eventSlug?: string,
    isNearMe: boolean = false
): SEOData => {
    
    const city = formatTitle(citySlug);
    const category = categorySlug ? formatTitle(categorySlug) : "";
    const locality = localitySlug ? formatTitle(localitySlug) : "";
    const event = eventSlug ? formatTitle(eventSlug) : "";
    const cityData = citiesData.find(c => c.slug.toLowerCase() === citySlug.toLowerCase());
    const actualCityImage = cityData?.image || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80";

    let title = "";
    let description = "";
    let h1 = "";
    let heroSubtitle = "";
    let targetKeyword = "";

    // 0. Near Me Pattern (Special UX/SEO Layer)
    if (isNearMe && categorySlug) {
        targetKeyword = `${category} Near Me in ${city}`;
        title = `${category} Near Me in ${city} | Photos, Prices & Reviews - VenueConnect`;
        description = `Find ${category.toLowerCase()} near you in ${city}. Browse top-rated banquet halls, wedding hotels & party plots with real photos and transparent pricing. Book your perfect venue today.`;
        h1 = `${category} Near Me in ${city}`;
        heroSubtitle = `Discover the best ${category.toLowerCase()} closest to your location in ${city}. Verified listings with instant quotes.`;
    }
    // 1. Locality-Specific (Hyper-local Layer)
    else if (localitySlug && categorySlug) {
        targetKeyword = `${category} in ${locality}, ${city}`;
        title = `Best ${category} in ${locality}, ${city} | Photos & Prices - VenueConnect`;
        description = `Find the top-rated ${category.toLowerCase()} in ${locality}, ${city}. Compare banquet halls, wedding lawns & luxury spaces. Get free quotes and exclusive deals on VenueConnect.`;
        h1 = `Best ${category} in ${locality}, ${city}`;
        heroSubtitle = `Explore verified ${category.toLowerCase()} in the ${locality} area of ${city}. Perfect for your upcoming grand celebration.`;
    } 
    // 2. Event-Specific (Event Intent Layer)
    else if (eventSlug && citySlug) {
        const locationName = locality ? `${locality}, ${city}` : city;
        targetKeyword = `${event} Venues in ${locationName}`;
        title = `Best ${event} Venues in ${locationName} | Book & Compare Prices - VenueConnect`;
        description = `Find the best ${event.toLowerCase()} venues in ${locationName}. Compare halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on VenueConnect.`;
        h1 = `Best ${event} Venues in ${locationName}`;
        heroSubtitle = `Looking for the perfect spot for your ${event.toLowerCase()}? Discover the most loved spaces in ${locationName} with real user reviews.`;
    }
    // 3. Category-Specific (Core Category Layer)
    else if (categorySlug && citySlug) {
        targetKeyword = `${category} in ${city}`;
        title = `${category} in ${city} | Find & Book the Best Venues - VenueConnect`;
        description = `Verified list of ${category.toLowerCase()} in ${city}. View photos, guest capacity, and book the most popular ${category.toLowerCase()} at guaranteed best prices. Trusted by thousands in Gujarat.`;
        h1 = `${category} in ${city}`;
        heroSubtitle = `Browse the ultimate selection of ${category.toLowerCase()} across ${city}. Handpicked for quality, service excellence and price transparency.`;
    } else {
        targetKeyword = city;
        title = `Best Event Venues & Vendors in ${city} | VenueConnect`;
        description = `Discover top-rated banquet halls, wedding photographers, and decorators in ${city}. Your one-stop shop for event planning in Gujarat.`;
        h1 = `Event Planning in ${city}`;
        heroSubtitle = `Connecting you with the best professionals and spaces in ${city}.`;
    }

    // AEO Content with dynamic keywords
    const content = `
        <p>Searching for <strong>${targetKeyword.toLowerCase()}</strong>? You've come to the right place. VenueConnect is Gujarat's leading platform for finding verified event spaces and professionals. Whether it's a grand wedding or an intimate birthday party, we help you find the perfect match in <strong>${city}</strong>.</p>
        <p>In <strong>${locality || city}</strong>, we have curated a list of the most sought-after ${category.toLowerCase() || 'venues'} that offer a blend of luxury, convenience, and affordability. From 5-star hotels to scenic party plots, your search for the ideal ${event.toLowerCase() || 'event'} location ends here.</p>
    `;

    // FAQ Schema for AEO
    const faqs = [
        {
            question: `How can I find ${targetKeyword.toLowerCase()}?`,
            answer: `You can browse the verified listings on VenueConnect, filter by your specific location in ${city}, and check prices and photos directly.`
        },
        {
            question: `What is the average price for ${category.toLowerCase() || 'venues'} in ${locality || city}?`,
            answer: `Prices vary depending on the venue type and services. In ${city}, options typically start from ₹500 per plate for budget venues and can go up to ₹3,000+ for luxury hotels.`
        },
        {
            question: `Can I get direct quotes from ${category.toLowerCase() || 'these venues'}?`,
            answer: `Yes, VenueConnect allows you to click 'Get Quotes' on any listing to receive direct pricing and availability information from the venue owners.`
        }
    ];

    const faqSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    });

    const breadcrumbs = [
        { name: "Home", item: `${baseUrl}` }
    ];

    if (citySlug) breadcrumbs.push({ name: city, item: `${baseUrl}/${citySlug}` });
    if (localitySlug) breadcrumbs.push({ name: locality, item: `${baseUrl}/${citySlug}/${localitySlug}` });
    if (categorySlug) {
        const path = isNearMe 
            ? `${categorySlug}-near-me-in-${citySlug}`
            : `${citySlug}/${localitySlug ? localitySlug + '/' : ''}${categorySlug}`;
        breadcrumbs.push({ name: category, item: `${baseUrl}/${path}` });
    }
    if (eventSlug) breadcrumbs.push({ name: event, item: `${baseUrl}/venues-for/${eventSlug}` });

    return {
        title,
        description,
        h1,
        heroSubtitle,
        content,
        faqSchema,
        cityImage: actualCityImage,
        breadcrumbs
    };
};
