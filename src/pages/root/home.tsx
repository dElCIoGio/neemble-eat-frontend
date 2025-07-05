import {Hero} from "@/components/pages/home/Hero";
import {Features} from "@/components/pages/home/Features";
import Benefits from "@/components/pages/home/Benefits";
import Pricing from "@/components/pages/home/Pricing";
import {Testimonials} from "@/components/pages/home/Testimonials";
import {Faq} from "@/components/pages/home/Faq";
import {Cta} from "@/components/pages/home/CTA";
import WhyNeembleEat from "@/components/pages/home/why";


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

            {/* Why Us */}
            <WhyNeembleEat/>

            {/* FAQs Section */}
            <Faq/>

            {/* CTA Section */}
            <Cta/>
        </div>
    );
}

