import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { AboutIntro } from "@/components/sections/about-intro";
import { VideoIntro } from "@/components/sections/video-intro";
import { StatsSlider } from "@/components/sections/stats-slider";
import { CareerTimeline } from "@/components/sections/career-timeline";
import { Certificates } from "@/components/sections/certificates";
import { MainSpecialties } from "@/components/sections/main-specialties";
import { DoctorMessage } from "@/components/sections/doctor-message";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutIntro />
        <VideoIntro />
        <StatsSlider />
        <CareerTimeline />
        <Certificates />
        <MainSpecialties />
        <DoctorMessage />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
