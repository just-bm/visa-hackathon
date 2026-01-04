import GetInTouch from "../sections/get-in-touch";
import OurTestimonials from "../sections/our-testimonials";
import SubscribeNewsletter from "../sections/subscribe-newsletter";
import TrustedCompanies from "../sections/trusted-companies";
import Footer from "../components/footer";
import LenisScroll from "../components/lenis-scroll";
import Navbar from "../components/Navbar";
import AboutOurApps from "../sections/about-our-apps";
import HeroSection from "../sections/hero-section";
import OurLatestCreation from "../sections/our-latest-creation";

export default function Home() {
    return (
        <>
            <LenisScroll />
            <main className="px-6 md:px-16 lg:px-24 xl:px-32">
                <HeroSection />
                <OurLatestCreation />
                <AboutOurApps />
                <OurTestimonials />
                <TrustedCompanies />
                <GetInTouch />
                <SubscribeNewsletter />
            </main>
            <Footer />
        </>
    );
}