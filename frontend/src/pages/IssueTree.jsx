import { Plus, Trash2, GitBranch, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultIssueTree } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function IssueTree() {
  const [tree, setTree] = useLocalStorage("strategy-issue-tree", defaultIssueTree());
  const previewId = "issue-tree-preview";

  const update = (field, value) => setTree({ ...tree, [field]: value });

  const updateBranch = (branchId, field, value) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => (b.id === branchId ? { ...b, [field]: value } : b)),
    });
  };
  const removeBranch = (branchId) => setTree({ ...tree, branches: tree.branches.filter((b) => b.id !== branchId) });
  const addBranch = () => setTree({ ...tree, branches: [...tree.branches, { id: newId("br"), label: "New branch", analyses: [], children: [] }] });

  const updateNested = (branchId, childId, field, value) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => b.id !== branchId ? b : { ...b, children: b.children.map((c) => (c.id === childId ? { ...c, [field]: value } : c)) }),
    });
  };
  const addNested = (branchId) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => b.id !== branchId ? b : { ...b, children: [...b.children, { id: newId("br"), label: "New sub-branch", analyses: [] }] }),
    });
  };
  const removeNested = (branchId, childId) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => b.id !== branchId ? b : { ...b, children: b.children.filter((c) => c.id !== childId) }),
    });
  };

  const updateAnalysis = (branchId, analysisId, value, parentId = null) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => {
        if (parentId === null) {
          if (b.id !== branchId) return b;
          return { ...b, analyses: b.analyses.map((a) => (a.id === analysisId ? { ...a, label: value } : a)) };
        }
        if (b.id !== parentId) return b;
        return { ...b, children: b.children.map((c) => (c.id !== branchId ? c : { ...c, analyses: c.analyses.map((a) => (a.id === analysisId ? { ...a, label: value } : a)) })) };
      }),
    });
  };
  const addAnalysis = (branchId, parentId = null) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => {
        if (parentId === null) {
          if (b.id !== branchId) return b;
          return { ...b, analyses: [...b.analyses, { id: newId("an"), label: "New analysis" }] };
        }
        if (b.id !== parentId) return b;
        return { ...b, children: b.children.map((c) => (c.id !== branchId ? c : { ...c, analyses: [...c.analyses, { id: newId("an"), label: "New analysis" }] })) };
      }),
    });
  };
  const removeAnalysis = (branchId, analysisId, parentId = null) => {
    setTree({
      ...tree,
      branches: tree.branches.map((b) => {
        if (parentId === null) {
          if (b.id !== branchId) return b;
          return { ...b, analyses: b.analyses.filter((a) => a.id !== analysisId) };
        }
        if (b.id !== parentId) return b;
        return { ...b, children: b.children.map((c) => (c.id !== branchId ? c : { ...c, analyses: c.analyses.filter((a) => a.id !== analysisId) })) };
      }),
    });
  };

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="issue-tree-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><GitBranch size={14} /> Strategy Consultant</p>
          <h1>Hypothesis / Issue Tree</h1>
          <p>Root question → MECE branches → required analyses. Build the tree top-down to keep the work hypothesis-driven.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `issue-tree.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Root</h2>
        <div className="hiring-form-grid">
          <label className="hiring-field-wide">Root question<input value={tree.rootQuestion} onChange={(event) => update("rootQuestion", event.target.value)} data-testid="tree-root-input" /></label>
          <label>Date<input type="date" value={tree.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label className="hiring-field-wide">Context<input value={tree.context} onChange={(event) => update("context", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="issue-tree-editor-panel">
        <div className="panel-heading">
          <h2>Branches</h2>
          <button className="secondary-button" onClick={addBranch}><Plus size={16} /> Add branch</button>
        </div>
        <div className="issue-tree-branches">
          {tree.branches.map((branch, index) => (
            <div key={branch.id} className="issue-tree-branch" data-testid={`branch-${index}`}>
              <div className="panel-heading">
                <input className="issue-tree-label" value={branch.label} onChange={(event) => updateBranch(branch.id, "label", event.target.value)} placeholder="Branch question / hypothesis" />
                <button className="icon-button" onClick={() => removeBranch(branch.id)} aria-label="Remove"><Trash2 size={14} /></button>
              </div>

              <div className="issue-tree-section">
                <div className="panel-heading">
                  <h4>Required analyses</h4>
                  <button className="text-button" onClick={() => addAnalysis(branch.id)}><Plus size={14} /> Analysis</button>
                </div>
                {branch.analyses.map((a) => (
                  <div key={a.id} className="line-item-row analysis-row">
                    <input value={a.label} onChange={(event) => updateAnalysis(branch.id, a.id, event.target.value)} placeholder="Analysis required" />
                    <button className="icon-button mini" onClick={() => removeAnalysis(branch.id, a.id)} aria-label="Remove"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>

              <div className="issue-tree-section">
                <div className="panel-heading">
                  <h4>Sub-branches</h4>
                  <button className="text-button" onClick={() => addNested(branch.id)}><Plus size={14} /> Sub-branch</button>
                </div>
                {branch.children.map((child) => (
                  <div key={child.id} className="issue-tree-subbranch">
                    <div className="panel-heading">
                      <input className="issue-tree-sublabel" value={child.label} onChange={(event) => updateNested(branch.id, child.id, "label", event.target.value)} placeholder="Sub-branch" />
                      <button className="icon-button" onClick={() => removeNested(branch.id, child.id)} aria-label="Remove"><Trash2 size={12} /></button>
                    </div>
                    {child.analyses.map((a) => (
                      <div key={a.id} className="line-item-row analysis-row">
                        <input value={a.label} onChange={(event) => updateAnalysis(child.id, a.id, event.target.value, branch.id)} placeholder="Analysis" />
                        <button className="icon-button mini" onClick={() => removeAnalysis(child.id, a.id, branch.id)} aria-label="Remove"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <button className="text-button" onClick={() => addAnalysis(child.id, branch.id)}><Plus size={14} /> Analysis</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Tree preview</h2>
        <div id={previewId} className="hiring-document" data-testid="issue-tree-preview">
          <header>
            <p className="eyebrow">Issue Tree</p>
            <h1>{tree.rootQuestion}</h1>
            <p>{tree.date} · {tree.context}</p>
          </header>
          {tree.branches.map((b, index) => (
            <div key={b.id}>
              <h2>{index + 1}. {b.label}</h2>
              {b.analyses.length > 0 && (
                <>
                  <p><strong>Analyses:</strong></p>
                  <ul>{b.analyses.map((a) => <li key={a.id}>{a.label}</li>)}</ul>
                </>
              )}
              {b.children.map((c, ci) => (
                <div key={c.id}>
                  <h3>{index + 1}.{ci + 1} {c.label}</h3>
                  <ul>{c.analyses.map((a) => <li key={a.id}>{a.label}</li>)}</ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="issue-tree" />
    </div>
  );
}
