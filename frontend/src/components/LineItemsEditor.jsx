import { Plus, Trash2 } from "lucide-react";
import { calculateLineAmount, formatMoney } from "../utils/calculations";

export const LineItemsEditor = ({ items, onChange, variant }) => {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    onChange([...items, { id: `line-${Date.now()}`, description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    onChange(items.length === 1 ? items : items.filter((_item, itemIndex) => itemIndex !== index));
  };

  return (
    <section className="form-section" data-testid={`${variant}-line-items-editor`}>
      <div className="section-heading-row">
        <h3 data-testid={`${variant}-line-items-title`}>Line items</h3>
        <button className="text-button" type="button" onClick={addItem} data-testid={`${variant}-add-line-item-button`}><Plus size={16} /> Add item</button>
      </div>
      <div className="line-items-table" data-testid={`${variant}-line-items-table`}>
        {items.map((item, index) => (
          <div className="line-item-row" key={item.id} data-testid={`${variant}-line-item-row-${index}`}>
            <input value={item.description} placeholder="Description" onChange={(event) => updateItem(index, "description", event.target.value)} data-testid={`${variant}-line-description-input-${index}`} />
            <input value={item.quantity} type="number" min="0" step="0.01" onChange={(event) => updateItem(index, "quantity", event.target.value)} data-testid={`${variant}-line-quantity-input-${index}`} />
            <input value={item.rate} type="number" min="0" step="0.01" onChange={(event) => updateItem(index, "rate", event.target.value)} data-testid={`${variant}-line-rate-input-${index}`} />
            <strong data-testid={`${variant}-line-amount-display-${index}`}>{formatMoney(calculateLineAmount(item))}</strong>
            <button className="icon-button" type="button" onClick={() => removeItem(index)} disabled={items.length === 1} data-testid={`${variant}-remove-line-item-button-${index}`} aria-label="Remove line item"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </section>
  );
};