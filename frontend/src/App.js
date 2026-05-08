import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import DocumentGenerator from "./pages/DocumentGenerator";
import VatCalculator from "./pages/VatCalculator";
import TaxEstimator from "./pages/TaxEstimator";
import ReceiptGenerator from "./pages/ReceiptGenerator";
import Templates, { TemplatePage } from "./pages/Templates";
import PlanningHome from "./pages/PlanningHome";
import BudgetCalculator from "./pages/BudgetCalculator";
import GoalProductivityCalculator from "./pages/GoalProductivityCalculator";
import DigitalDetoxCalculator from "./pages/DigitalDetoxCalculator";
import NotFound from "./pages/NotFound";
import StartupHome from "./pages/StartupHome";
import BusinessPlanGenerator from "./pages/BusinessPlanGenerator";
import ContractGenerator from "./pages/ContractGenerator";
import ProductBusinessManager from "./pages/ProductBusinessManager";
import SeisEisChecker from "./pages/SeisEisChecker";
import CapTableBuilder from "./pages/CapTableBuilder";
import RunwayCalculator from "./pages/RunwayCalculator";
import BreakEvenCalculator from "./pages/BreakEvenCalculator";
import PitchDeckGenerator from "./pages/PitchDeckGenerator";
import HiringHome from "./pages/HiringHome";
import EmploymentContractGenerator from "./pages/EmploymentContractGenerator";
import OfferLetterGenerator from "./pages/OfferLetterGenerator";
import EmiGrantGenerator from "./pages/EmiGrantGenerator";
import NdaGenerator from "./pages/NdaGenerator";
import LegalHome from "./pages/LegalHome";
import PrivacyPolicyGenerator from "./pages/PrivacyPolicyGenerator";
import CookiePolicyGenerator from "./pages/CookiePolicyGenerator";
import TermsOfServiceGenerator from "./pages/TermsOfServiceGenerator";
import DpaGenerator from "./pages/DpaGenerator";
import OpsHome from "./pages/OpsHome";
import FounderAgreementGenerator from "./pages/FounderAgreementGenerator";
import OkrTracker from "./pages/OkrTracker";
import InterviewScriptGenerator from "./pages/InterviewScriptGenerator";
import CompetitorMatrix from "./pages/CompetitorMatrix";
import ProductHome from "./pages/ProductHome";
import PrdGenerator from "./pages/PrdGenerator";
import RicePrioritisation from "./pages/RicePrioritisation";
import StoryMapBuilder from "./pages/StoryMapBuilder";
import SprintRetro from "./pages/SprintRetro";
import PmOkrTracker from "./pages/PmOkrTracker";
import LaunchCommsPlan from "./pages/LaunchCommsPlan";
import FeatureKillMemo from "./pages/FeatureKillMemo";
import InterviewSynthesis from "./pages/InterviewSynthesis";
import Ir35Determinator from "./pages/Ir35Determinator";
import DayRateComparator from "./pages/DayRateComparator";
import StrategyHome from "./pages/StrategyHome";
import SwotMatrix from "./pages/SwotMatrix";
import FiveForcesAnalysis from "./pages/FiveForces";
import MarketSizing from "./pages/MarketSizing";
import TwoByTwoMatrix from "./pages/TwoByTwoMatrix";
import ExecSummary from "./pages/ExecSummary";
import IssueTree from "./pages/IssueTree";
import ProjectCharter from "./pages/ProjectCharter";
import OptionsMemo from "./pages/OptionsMemo";
import StrategyFrameworkLibrary from "./pages/StrategyFrameworkLibrary";
import BcgMatrix from "./pages/BcgMatrix";
import AnsoffMatrix from "./pages/AnsoffMatrix";
import PestelAnalysis from "./pages/PestelAnalysis";
import BusinessModelCanvas from "./pages/BusinessModelCanvas";
import VrioFramework from "./pages/VrioFramework";
import RootCauseAnalysis from "./pages/RootCauseAnalysis";
import BusinessAnalysisHome from "./pages/BusinessAnalysisHome";
import BrdGenerator from "./pages/BrdGenerator";
import TraceabilityMatrix from "./pages/TraceabilityMatrix";
import ProcessFlow from "./pages/ProcessFlow";
import DataDictionary from "./pages/DataDictionary";
import GapAnalysis from "./pages/GapAnalysis";
import StakeholderMap from "./pages/StakeholderMap";
import UseCaseSpec from "./pages/UseCaseSpec";
import AcceptanceCriteria from "./pages/AcceptanceCriteria";
import ProjectManagementHome from "./pages/ProjectManagementHome";
import RaciMatrix from "./pages/RaciMatrix";
import RiskRegister from "./pages/RiskRegister";
import RagStatusReport from "./pages/RagStatusReport";
import CommunicationPlan from "./pages/CommunicationPlan";
import ChangeRequest from "./pages/ChangeRequest";
import LessonsLearned from "./pages/LessonsLearned";
import MilestoneRoadmap from "./pages/MilestoneRoadmap";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/invoices" element={<DocumentGenerator variant="invoice" />} />
          <Route path="/quotes" element={<DocumentGenerator variant="quote" />} />
          <Route path="/vat-calculator" element={<VatCalculator />} />
          <Route path="/tax-estimator" element={<TaxEstimator />} />
          <Route path="/receipts" element={<ReceiptGenerator />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:slug" element={<TemplatePage />} />
          <Route path="/planning" element={<PlanningHome />} />
          <Route path="/planning/uk-budget-planner" element={<BudgetCalculator type="uk-budget-planner" />} />
          <Route path="/planning/marriage-budget-calculator" element={<BudgetCalculator type="marriage-budget-calculator" />} />
          <Route path="/planning/business-budget-calculator" element={<BudgetCalculator type="business-budget-calculator" />} />
          <Route path="/planning/startup-expense-calculator" element={<BudgetCalculator type="startup-expense-calculator" />} />
          <Route path="/planning/goal-productivity-calculator" element={<GoalProductivityCalculator />} />
          <Route path="/planning/digital-detox-calculator" element={<DigitalDetoxCalculator />} />
          <Route path="/startup" element={<StartupHome />} />
          <Route path="/startup/business-plan-generator" element={<BusinessPlanGenerator />} />
          <Route path="/startup/consulting-client-contract" element={<ContractGenerator />} />
          <Route path="/startup/product-business-management" element={<ProductBusinessManager />} />
          <Route path="/startup/seis-eis-checker" element={<SeisEisChecker />} />
          <Route path="/startup/cap-table-builder" element={<CapTableBuilder />} />
          <Route path="/startup/runway-calculator" element={<RunwayCalculator />} />
          <Route path="/startup/break-even-calculator" element={<BreakEvenCalculator />} />
          <Route path="/startup/pitch-deck-generator" element={<PitchDeckGenerator />} />
          <Route path="/hiring" element={<HiringHome />} />
          <Route path="/hiring/employment-contract" element={<EmploymentContractGenerator />} />
          <Route path="/hiring/offer-letter" element={<OfferLetterGenerator />} />
          <Route path="/hiring/emi-grant" element={<EmiGrantGenerator />} />
          <Route path="/hiring/nda" element={<NdaGenerator />} />
          <Route path="/legal" element={<LegalHome />} />
          <Route path="/legal/privacy-policy" element={<PrivacyPolicyGenerator />} />
          <Route path="/legal/cookie-policy" element={<CookiePolicyGenerator />} />
          <Route path="/legal/terms-of-service" element={<TermsOfServiceGenerator />} />
          <Route path="/legal/dpa" element={<DpaGenerator />} />
          <Route path="/ops" element={<OpsHome />} />
          <Route path="/ops/founder-agreement" element={<FounderAgreementGenerator />} />
          <Route path="/ops/okr-tracker" element={<OkrTracker />} />
          <Route path="/ops/interview-script" element={<InterviewScriptGenerator />} />
          <Route path="/ops/competitor-matrix" element={<CompetitorMatrix />} />
          <Route path="/product" element={<ProductHome />} />
          <Route path="/product/prd-generator" element={<PrdGenerator />} />
          <Route path="/product/rice" element={<RicePrioritisation />} />
          <Route path="/product/story-map" element={<StoryMapBuilder />} />
          <Route path="/product/retro" element={<SprintRetro />} />
          <Route path="/product/pm-okrs" element={<PmOkrTracker />} />
          <Route path="/product/launch-comms" element={<LaunchCommsPlan />} />
          <Route path="/product/kill-memo" element={<FeatureKillMemo />} />
          <Route path="/product/interview-synthesis" element={<InterviewSynthesis />} />
          <Route path="/product/ir35" element={<Ir35Determinator />} />
          <Route path="/product/day-rate" element={<DayRateComparator />} />
          <Route path="/strategy" element={<StrategyHome />} />
          <Route path="/strategy/swot" element={<SwotMatrix />} />
          <Route path="/strategy/five-forces" element={<FiveForcesAnalysis />} />
          <Route path="/strategy/market-sizing" element={<MarketSizing />} />
          <Route path="/strategy/two-by-two" element={<TwoByTwoMatrix />} />
          <Route path="/strategy/exec-summary" element={<ExecSummary />} />
          <Route path="/strategy/issue-tree" element={<IssueTree />} />
          <Route path="/strategy/project-charter" element={<ProjectCharter />} />
          <Route path="/strategy/options-memo" element={<OptionsMemo />} />
          <Route path="/strategy/framework-library" element={<StrategyFrameworkLibrary />} />
          <Route path="/strategy/bcg-matrix" element={<BcgMatrix />} />
          <Route path="/strategy/ansoff-matrix" element={<AnsoffMatrix />} />
          <Route path="/strategy/pestel" element={<PestelAnalysis />} />
          <Route path="/strategy/business-model-canvas" element={<BusinessModelCanvas />} />
          <Route path="/strategy/vrio" element={<VrioFramework />} />
          <Route path="/strategy/rca" element={<RootCauseAnalysis />} />
          <Route path="/business-analysis" element={<BusinessAnalysisHome />} />
          <Route path="/business-analysis/brd" element={<BrdGenerator />} />
          <Route path="/business-analysis/traceability" element={<TraceabilityMatrix />} />
          <Route path="/business-analysis/process-flow" element={<ProcessFlow />} />
          <Route path="/business-analysis/data-dictionary" element={<DataDictionary />} />
          <Route path="/business-analysis/gap-analysis" element={<GapAnalysis />} />
          <Route path="/business-analysis/stakeholder-map" element={<StakeholderMap />} />
          <Route path="/business-analysis/use-case" element={<UseCaseSpec />} />
          <Route path="/business-analysis/acceptance-criteria" element={<AcceptanceCriteria />} />
          <Route path="/project-management" element={<ProjectManagementHome />} />
          <Route path="/project-management/raci" element={<RaciMatrix />} />
          <Route path="/project-management/risk-register" element={<RiskRegister />} />
          <Route path="/project-management/rag-status" element={<RagStatusReport />} />
          <Route path="/project-management/comms-plan" element={<CommunicationPlan />} />
          <Route path="/project-management/change-request" element={<ChangeRequest />} />
          <Route path="/project-management/lessons-learned" element={<LessonsLearned />} />
          <Route path="/project-management/milestone-roadmap" element={<MilestoneRoadmap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
