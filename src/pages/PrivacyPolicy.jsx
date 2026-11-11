import LegalPage from '@/components/common/LegalPage';
import { IMAGES } from '@/lib/cms';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      crumb="Privacy Policy"
      intro="How Tuzuru Africa collects, uses and protects personal information, written with Kenya’s Data Protection Act, 2019 in mind."
      updated="10 November 2026"
      image={IMAGES.craft}
      sections={[
        {
          heading: 'Who we are',
          paragraphs: [
            'Tuzuru Africa is a travel and tourism business that plans trips across East and Southern Africa. For the purposes of Kenya’s Data Protection Act, 2019, we are the data controller for the personal information described in this policy.',
            'Registered company details, postal address and the identity of the data protection contact must be completed before publication.',
          ],
        },
        {
          heading: 'Information we collect',
          paragraphs: ['We aim to collect only what is needed to answer an enquiry and arrange a trip.'],
          list: [
            'Contact details you give us: name, email address, telephone or WhatsApp number, and country of residence.',
            'Trip details you choose to share: destinations of interest, travel dates, party size, budget range, accommodation and travel-style preferences, and any additional requests.',
            'Correspondence you send us, including messages through the website, email or WhatsApp.',
            'Technical information generated when you use the site, such as the pages you visit, in aggregate and non-identifying form.',
          ],
        },
        {
          heading: 'How we use your information',
          paragraphs: [
            'We use your information to respond to your enquiry, prepare quotations and itineraries, arrange the services you ask for, keep records of our correspondence, and meet our legal and accounting obligations.',
            'We do not sell personal information, and we do not add you to marketing lists without a separate, explicit opt-in.',
          ],
        },
        {
          heading: 'Lawful basis',
          paragraphs: [
            'Depending on the activity, we rely on your consent (when you submit an enquiry or opt in to communications), the performance of a contract or steps taken at your request before a contract, and our legitimate interests in operating and improving the business — balanced against your rights.',
          ],
        },
        {
          heading: 'Who we share information with',
          paragraphs: [
            'To arrange a trip we may need to share the minimum necessary details with the suppliers involved — lodges, camps, ground handlers, guides, domestic airlines and insurers. Those suppliers are only given what is required for the service concerned.',
            'We also use service providers for website hosting, email delivery and payment processing. These providers process information on our instructions.',
          ],
        },
        {
          heading: 'Retention',
          paragraphs: [
            'Enquiry records are retained for as long as needed to respond and, where a trip is arranged, for the period required for accounting and legal records. Information that is no longer needed is deleted or anonymised. Specific retention periods must be agreed and documented before launch.',
          ],
        },
        {
          heading: 'International transfers',
          paragraphs: [
            'Some suppliers and service providers may be located outside Kenya. Where information is transferred internationally, we take steps to ensure it remains protected to a standard consistent with the Act, including appropriate contractual safeguards.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'Access to enquiries is limited to staff who need it. We use access controls, encrypted connections and reputable hosting providers. No system is entirely risk-free, and we cannot guarantee absolute security.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'Subject to the Act, you may ask for access to the personal information we hold about you, ask us to correct inaccurate information, ask us to delete information we no longer have a lawful reason to keep, object to certain processing, or withdraw consent where consent is the basis for processing.',
            'To exercise a right, contact us using the details on the Contact page. We will respond within the time required by law. You also have the right to complain to the Office of the Data Protection Commissioner in Kenya.',
          ],
        },
        {
          heading: 'Cookies and tracking',
          paragraphs: [
            'The site uses only the cookies and similar storage needed to operate and to understand aggregate usage. Where analytics or advertising tools are added, this section and the site’s consent controls must be updated before they are enabled.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: [
            'We may update this policy as our services change. The date at the top of the page shows when it was last revised.',
          ],
        },
      ]}
    />
  );
}