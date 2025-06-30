import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

            <p className="mb-4">
                At Outframe, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
            <p className="mb-4">
                When you use Outframe, we may collect:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Your name and email address (from your Notion account)</li>
                <li>Access to your Notion workspace and selected content</li>
                <li>Technical data such as browser type, device, and usage statistics</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
            <p className="mb-4">
                We use the information to:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Generate content from your Notion workspace</li>
                <li>Provide and improve the Outframe service</li>
                <li>Send you service-related communications</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Sharing</h2>
            <p className="mb-4">
                We do not sell your data. We may share data with third-party services strictly for functionality (e.g., Notion API, analytics providers, or email delivery tools). All third parties must meet strict data protection standards.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Retention</h2>
            <p className="mb-4">
                We retain your information only as long as needed to provide the service. You may request deletion of your data at any time by contacting us.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">5. Security</h2>
            <p className="mb-4">
                We use modern security practices to protect your data, including encryption and secure authentication. However, no online system is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">6. Your Rights</h2>
            <p className="mb-4">
                You have the right to:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Access the data we store about you</li>
                <li>Request correction or deletion</li>
                <li>Withdraw consent to data processing</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">7. Updates</h2>
            <p className="mb-4">
                We may update this policy to reflect changes to our practices. We will notify you of significant changes via email or in-app notice.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">8. Contact</h2>
            <p className="mb-4">
                If you have any questions or concerns about this policy, contact us at <a href="mailto:hello@outframe.so" className="text-blue-600 underline">hello@outframe.so</a>.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
