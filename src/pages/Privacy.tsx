import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO 
                title="Privacy Policy | VenueConnect"
                description="Read VenueConnect's privacy policy to understand how we collect, use, and protect your data."
            />
            <Navbar />

            <PageHeader
                title="Privacy Policy"
                subtitle="How we collect, use, and protect your data."
            />

            <main className="flex-grow container py-16 max-w-3xl mx-auto prose prose-slate">
                <p className="lead">
                    At Venue Finder, we take your privacy seriously. This privacy policy describes how and why we collect, store, use, and share your personal information when you use our services.
                </p>

                <h3>1. Information We Collect</h3>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
                </p>
                <ul>
                    <li><strong>Personal Information provided by you:</strong> We collect names; phone numbers; email addresses; passwords; contact preferences; and other similar information.</li>
                    <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number and the security code associated with your payment instrument.</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>
                    We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
                </p>
                <ul>
                    <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
                    <li>To respond to user inquiries/offer support to users.</li>
                    <li>To send administrative information to you.</li>
                    <li>To fulfill and manage your orders and bookings.</li>
                </ul>

                <h3>3. Will Your Information be Shared with Anyone?</h3>
                <p>
                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. For instance, when you request a quote from a vendor, your contact details are shared with that specific vendor.
                </p>

                <h3>4. How Long Do We Keep Your Information?</h3>
                <p>
                    We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
                </p>

                <h3>5. How Do We Keep Your Information Safe?</h3>
                <p>
                    We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>

                <h3>6. Contact Us</h3>
                <p>
                    If you have questions or comments about this notice, you may email us at privacy@venuefinder.com or by post to:
                    <br /><br />
                    Venue Finder<br />
                    100 Feet Anand Nagar Rd<br />
                    Ahmedabad, Gujarat 380015
                </p>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
