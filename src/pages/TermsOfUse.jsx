import LegalPage from '@/components/common/LegalPage';
import { IMAGES } from '@/lib/cms';

export default function TermsOfUse() {
  return (
    <LegalPage
      title="Terms of Use"
      crumb="Terms of Use"
      intro="The terms on which this website is provided, and what you can expect from the information published here."
      updated="10 November 2026"
      image={IMAGES.door}
      sections={[
        {
          heading: 'Using this website',
          paragraphs: [
            'By using this website you agree to these terms. If you do not accept them, please do not use the site.',
            'You may browse, print and share pages for your own non-commercial travel planning. You may not copy, republish or resell substantial parts of the site, or use it in a way that interferes with its operation or with other visitors.',
          ],
        },
        {
          heading: 'Information on this site',
          paragraphs: [
            'We take care to describe destinations, itineraries and services accurately, but travel information changes: park fees, opening times, seasonal access, visas and health requirements are all outside our control.',
            'Descriptions, itineraries and images on this site are indicative. They do not form part of a contract. The terms of any trip are set out in a written quotation and the booking terms provided with it.',
            'Nothing on this site is a live availability or pricing claim. Availability and prices are confirmed in writing for your specific dates.',
          ],
        },
        {
          heading: 'Enquiries are not bookings',
          paragraphs: [
            'Submitting the enquiry form starts a conversation. It does not reserve accommodation, hold a place, or create a contract. A trip is only confirmed when a written quotation has been accepted and the payment terms in it have been met.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'The Tuzuru Africa name, logo and brand elements belong to Tuzuru Africa and may not be used without written permission. Written content on this site is protected by copyright. Photography is used under licence or with permission; credits are recorded where required.',
          ],
        },
        {
          heading: 'Third-party links and services',
          paragraphs: [
            'Where we link to other websites, we do not control their content and are not responsible for it. Bookings or services arranged through third parties are subject to those parties’ own terms.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'We provide this website on an “as is” basis and do not warrant that it will always be available or free from error. To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of the site.',
            'Nothing in these terms limits liability that cannot lawfully be limited, including liability for death or personal injury caused by negligence, or for fraud.',
          ],
        },
        {
          heading: 'Your responsibilities',
          paragraphs: [
            'You are responsible for the accuracy of the information you send us, for holding valid travel documents, and for checking current entry, health and safety requirements for your trip. Do not submit other people’s personal information without their permission.',
          ],
        },
        {
          heading: 'Governing law',
          paragraphs: [
            'These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over any dispute, subject to any mandatory consumer protections that apply in your country of residence.',
          ],
        },
      ]}
    />
  );
}