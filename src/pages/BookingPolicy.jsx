import LegalPage from '@/components/common/LegalPage';
import { IMAGES } from '@/lib/cms';

export default function BookingPolicy() {
  return (
    <LegalPage
      title="Booking & Cancellation Policy"
      crumb="Booking Policy"
      intro="How enquiries become quotations, quotations become bookings, and what happens if plans change."
      updated="10 November 2026"
      image={IMAGES.gorge}
      sections={[
        {
          heading: 'Enquiry and quotation',
          paragraphs: [
            'An enquiry is a request for information. It costs nothing, creates no obligation and holds nothing.',
            'We reply with questions and, where helpful, an outline. A quotation follows once we understand your dates, party, route and preferred level of accommodation. Every quotation is valid for the period stated in it and lists what is included and excluded.',
            'Prices depend on season, availability, park and conservancy fees, permits and flight schedules. Figures move as those change.',
          ],
        },
        {
          heading: 'Reservation and confirmation',
          paragraphs: [
            'A reservation is made only when you accept a quotation in writing and any deposit it requires has been received and cleared. Until then, no dates are held.',
            'A booking is confirmed when we issue a written confirmation. That confirmation, together with these terms, forms the contract between us.',
            'Deposit amounts, balance due dates and payment methods are set out in your individual quotation. They depend on the suppliers involved; no standard figures are published here.',
          ],
        },
        {
          heading: 'Payments',
          paragraphs: [
            'Payment instructions are provided in writing with your quotation. We will not ask for payment to an account different from the one stated in that document — please verify with us before transferring anything.',
            'Bank charges, card fees and currency conversion costs are usually payable by the customer and will be stated where they apply.',
          ],
        },
        {
          heading: 'Cancellations',
          paragraphs: [
            'If you need to cancel, tell us in writing as early as possible. Cancellation charges depend on the terms of the lodges, airlines, permit authorities and operators booked on your behalf; they are set out in your quotation and confirmation.',
            'Where a supplier refunds us for a cancelled service, we pass that refund on, less any unrecoverable costs and any administration fee stated in your quotation.',
          ],
        },
        {
          heading: 'Amendments',
          paragraphs: [
            'Changes to dates, routes or party size may be possible but are subject to availability and supplier terms. Amendment fees may apply. We will confirm the effect of any change in writing before applying it.',
          ],
        },
        {
          heading: 'Supplier arrangements',
          paragraphs: [
            'We arrange services provided by third parties — accommodation, transport, guides and permits. Those suppliers operate under their own conditions, which may include their own cancellation and liability terms. We select them with care but do not control their operations.',
          ],
        },
        {
          heading: 'Changes and circumstances beyond control',
          paragraphs: [
            'Weather, wildlife behaviour, road and airstrip conditions, civil disruption, health emergencies and other events beyond our control can change an itinerary at short notice. Where this happens we will make reasonable alternative arrangements of a comparable standard. Refunds in such circumstances depend on what suppliers are able to recover.',
          ],
        },
        {
          heading: 'Your responsibilities',
          paragraphs: [
            'Please check that your passports, visas, permits and health documents are valid for your route, and take out travel insurance that covers medical costs, cancellation, curtailment and, where relevant, adventure activities. Tell us about any medical condition, dietary requirement or mobility need that affects your trip so we can plan for it.',
          ],
        },
        {
          heading: 'Complaints',
          paragraphs: [
            'If something goes wrong during your trip, tell your guide or our contact straight away so it can be addressed while you are there. If a matter remains unresolved, write to us within 28 days of your return and we will investigate.',
          ],
        },
      ]}
    />
  );
}