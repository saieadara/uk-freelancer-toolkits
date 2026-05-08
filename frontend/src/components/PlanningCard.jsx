import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const PlanningCard = ({ tool, index }) => {
  const Icon = tool.Icon;
  return (
    <Link className="tool-card planning-card reveal" style={{ animationDelay: `${index * 70}ms` }} to={tool.path} data-testid={`planning-card-${tool.id}`}>
      <div className="tool-card-top" data-testid={`planning-card-header-${tool.id}`}>
        <Icon size={22} aria-hidden="true" />
        <span data-testid={`planning-card-eyebrow-${tool.id}`}>{tool.eyebrow}</span>
      </div>
      <h3 data-testid={`planning-card-title-${tool.id}`}>{tool.title}</h3>
      <p data-testid={`planning-card-description-${tool.id}`}>{tool.description}</p>
      <span className="inline-action" data-testid={`planning-card-action-${tool.id}`}>{tool.action}<ArrowRight size={16} /></span>
    </Link>
  );
};