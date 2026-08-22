import { getLocale } from "next-intl/server";
import { getHomeReviewsSection } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";
import { Reviews } from "./reviews";

/** Reuses the existing <Reviews> component (already accepts eyebrow/
 * heading override props) against the same shared reviews table shown on
 * the Patient Stories page -- only the section heading and the "View All"
 * button are Home-specific. */
export async function HomeReviews() {
  const locale = await getLocale();
  const section = await getHomeReviewsSection();

  return (
    <Reviews
      sectionId="home-reviews"
      eyebrow={pickLocale(section?.eyebrow, locale)}
      heading={pickLocale(section?.heading, locale)}
      description={pickLocale(section?.description, locale)}
      viewAllHref="/patient-stories#patient-reviews"
      viewAllLabel={pickLocale(section?.view_all_label, locale)}
    />
  );
}
