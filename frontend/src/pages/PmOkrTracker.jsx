import OkrTracker from "./OkrTracker";
import { defaultPmOkrTracker } from "../data/product";

export default function PmOkrTracker() {
  return (
    <OkrTracker
      storageKey="product-pm-okrs"
      defaultFactory={defaultPmOkrTracker}
      eyebrowLabel="Product Management"
      pageTitle="PM OKR Tracker"
      pageDescription="Personal OKRs for an individual product manager — discovery, delivery, and growth goals with measurable key results."
      themeFieldLabel="PM theme"
      pageId="pm-okr-tracker-page"
      premiumSource="pm-okr-tracker"
    />
  );
}
