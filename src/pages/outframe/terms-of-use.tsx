import React from 'react';

const TermsOfUse: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

            <p className="mb-4">
                These Terms of Use ("Terms") govern your access to and use of Outframe ("Service", "we", "us", "our"), available at <a href="https://outframe.so" className="text-blue-600 underline">outframe.so</a>. By accessing or using the Service, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">1. Use of the Service</h2>
            <p className="mb-4">
                Outframe allows users to convert Notion content into public websites or shareable pages. You agree to use the Service only for lawful purposes and in accordance with these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">2. Eligibility</h2>
            <p className="mb-4">
                You must be at least 13 years old to use the Service. By using Outframe, you confirm that you meet this age requirement and that you have the legal capacity to enter into these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">3. Your Content</h2>
            <p className="mb-4">
                You retain full ownership of the content you import from Notion. However, by using Outframe, you grant us a limited license to display and process that content as needed to provide the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">4. Prohibited Conduct</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Using the Service for illegal, harmful, or abusive purposes</li>
                <li>Attempting to reverse-engineer or disrupt the platform</li>
                <li>Uploading content you don’t have the right to share</li>
                <li>Bypassing any security features or access restrictions</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">5. Termination</h2>
            <p className="mb-4">
                We reserve the right to suspend or terminate your access to the Service at any time if you violate these Terms or engage in behavior that harms the platform or other users.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">6. Intellectual Property</h2>
            <p className="mb-4">
                Outframe and all associated branding, code, and infrastructure are our property or licensed to us. You may not use our branding or reverse-engineer any part of the platform without prior permission.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">7. Third-Party Services</h2>
            <p className="mb-4">
                Outframe integrates with Notion and possibly other services. You are responsible for complying with the terms of those third-party platforms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">8. Disclaimer</h2>
            <p className="mb-4">
                The Service is provided "as is" and "as available." We make no guarantees about uptime, performance, or suitability for your specific use case. You use the platform at your own risk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">9. Limitation of Liability</h2>
            <p className="mb-4">
                To the fullest extent permitted by law, Outframe shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">10. Changes to the Terms</h2>
            <p className="mb-4">
                We may update these Terms from time to time. We will notify users of significant changes via email or in-app notices. Continued use after updates means you accept the revised Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">11. Contact Us</h2>
            <p className="mb-4">
                For questions or concerns regarding these Terms, contact us at <a href="mailto:hello@outframe.so" className="text-blue-600 underline">hello@outframe.so</a>.
            </p>
        </div>
    );
};

export default TermsOfUse;
