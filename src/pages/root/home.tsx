import {Hero} from "@/components/pages/home/Hero.tsx";
import {Features} from "@/components/pages/home/Features.tsx";
import Benefits from "@/components/pages/home/Benefits.tsx";
import Pricing from "@/components/pages/home/Pricing.tsx";
import {Testimonials} from "@/components/pages/home/Testimonials.tsx";
import {Faq} from "@/components/pages/home/Faq.tsx";
import {Cta} from "@/components/pages/home/CTA.tsx";


export function HomePage() {

    window.document.title = "Neemble Eat"

    return (
        <div>
            <Hero/>

            {/* Trusted By Section */}
            {/*<TrustedBy/>*/}

            {/* Features Section */}
            <Features/>

            {/* Benefits Section */}
            <Benefits/>

            {/* Pricing Section */}
            <Pricing/>

            {/* Testimonials Section */}
            <Testimonials/>

            {/* FAQs Section */}
            <Faq/>

            {/* CTA Section */}
            <Cta/>
        </div>
    );
}

