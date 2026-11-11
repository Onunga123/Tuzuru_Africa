import Hero from '@/components/home/Hero';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import FeaturedTours from '@/components/home/FeaturedTours';
import WhyTuzuru from '@/components/home/WhyTuzuru';
import ExperienceCategories from '@/components/home/ExperienceCategories';
import TravelInspiration from '@/components/home/TravelInspiration';
import HomeCta from '@/components/home/HomeCta';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <FeaturedTours />
      <WhyTuzuru />
      <ExperienceCategories />
      <TravelInspiration />
      <HomeCta />
    </>
  );
}