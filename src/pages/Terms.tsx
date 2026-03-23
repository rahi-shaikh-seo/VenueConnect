import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO 
                title="Terms of Service | VenueConnect"
                description="Read the terms of service that govern your use of the VenueConnect platform."
            />
            <Navbar />

            <PageHeader
                title="Terms of Service"
                subtitle="Please read these terms carefully before using our platform."
            />

            <main className="flex-grow container py-16 max-w-3xl mx-auto prose prose-slate">
                <p className="lead">
                    Welcome to Venue Finder. These Terms of Service ("Terms") govern your access to and use of our website, services, and applications.
                </p>

                <h3>1. Agreement to Terms</h3>
                <p>
                    By accessing or using our Services, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>

                <h3>2. Use License</h3>
                <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Venue Finder's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Venue Finder's website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>

                <h3>3. Service Provider Disclaimer</h3>
                <p>
                    Venue Finder acts solely as a platform to connect users with venues and vendors. We do not own, manage, or control any of the venues or vendor services listed on our platform. Therefore, we are not responsible for the quality, safety, or legality of the services provided by third-party vendors. Any transactions or agreements made are strictly between the user and the vendor.
                </p>

                <h3>4. User Accounts</h3>
                <p>
                    If you create an account on the Website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
                </p>

                <h3>5. Limitations</h3>
                <p>
                    In no event shall Venue Finder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Venue Finder's website, even if Venue Finder or a Venue Finder authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>

                <h3>6. Revisions and Errata</h3>
                <p>
                    The materials appearing on Venue Finder's website could include technical, typographical, or photographic errors. Venue Finder does not warrant that any of the materials on its website are accurate, complete, or current. Venue Finder may make changes to the materials contained on its website at any time without notice.
                </p>

                <h3>7. Governing Law</h3>
                <p>
                    Any claim relating to Venue Finder's website shall be governed by the laws of India without regard to its conflict of law provisions. General Terms and Conditions applicable to Use of a Web Site.
                </p>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
