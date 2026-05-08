export const Field = ({ id, label, children }) => (
  <label className="field" htmlFor={id} data-testid={`field-wrapper-${id}`}>
    <span data-testid={`field-label-${id}`}>{label}</span>
    {children}
  </label>
);

export const TextInput = ({ id, label, value, onChange, type = "text", placeholder }) => (
  <Field id={id} label={label}>
    <input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={`input-${id}`} />
  </Field>
);

export const TextArea = ({ id, label, value, onChange, rows = 3, placeholder }) => (
  <Field id={id} label={label}>
    <textarea id={id} value={value} rows={rows} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={`textarea-${id}`} />
  </Field>
);

export const SelectField = ({ id, label, value, onChange, options }) => (
  <Field id={id} label={label}>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} data-testid={`select-${id}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value} data-testid={`select-option-${id}-${option.value}`}>
          {option.label}
        </option>
      ))}
    </select>
  </Field>
);