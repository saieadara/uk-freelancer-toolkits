import { useState } from "react";
import { Plus, Trash2, Map, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultStoryMap } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function StoryMapBuilder() {
  const [map, setMap] = useLocalStorage("product-story-map", defaultStoryMap());
  const [draggedId, setDraggedId] = useState(null);
  const previewId = "story-map-preview";

  const update = (field, value) => setMap({ ...map, [field]: value });

  const addStage = () => setMap({ ...map, stages: [...map.stages, { id: newId("stage"), label: "New stage" }] });
  const updateStage = (id, label) => setMap({ ...map, stages: map.stages.map((s) => (s.id === id ? { ...s, label } : s)) });
  const removeStage = (id) => {
    if (map.stages.length <= 1) return;
    setMap({
      ...map,
      stages: map.stages.filter((s) => s.id !== id),
      stories: map.stories.filter((story) => story.stageId !== id),
    });
  };

  const addRelease = () => setMap({ ...map, releases: [...map.releases, { id: newId("release"), label: "New release" }] });
  const updateRelease = (id, label) => setMap({ ...map, releases: map.releases.map((r) => (r.id === id ? { ...r, label } : r)) });
  const removeRelease = (id) => {
    if (map.releases.length <= 1) return;
    setMap({
      ...map,
      releases: map.releases.filter((r) => r.id !== id),
      stories: map.stories.filter((story) => story.releaseId !== id),
    });
  };

  const addStory = (stageId, releaseId) => setMap({
    ...map,
    stories: [...map.stories, { id: newId("st"), stageId, releaseId, label: "New story" }],
  });
  const updateStory = (id, label) => setMap({ ...map, stories: map.stories.map((s) => (s.id === id ? { ...s, label } : s)) });
  const removeStory = (id) => setMap({ ...map, stories: map.stories.filter((s) => s.id !== id) });

  const onDragStart = (id) => setDraggedId(id);
  const onDragEnd = () => setDraggedId(null);
  const onDrop = (stageId, releaseId) => {
    if (!draggedId) return;
    setMap({ ...map, stories: map.stories.map((s) => (s.id === draggedId ? { ...s, stageId, releaseId } : s)) });
    setDraggedId(null);
  };

  const allowDrop = (event) => event.preventDefault();

  const cellStories = (stageId, releaseId) => map.stories.filter((s) => s.stageId === stageId && s.releaseId === releaseId);

  const copyText = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="story-map-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Map size={14} /> Product Management</p>
          <h1>User Story Map Builder</h1>
          <p>Stages of the user journey are columns; release slices are rows. Drag stories between cells to plan your MVP, your v2, and what gets parked.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyText}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(map.productName || "story-map").replace(/\s+/g, "-")}-story-map.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Map details</h2>
        <div className="hiring-form-grid">
          <label>Product / surface<input value={map.productName} onChange={(event) => update("productName", event.target.value)} /></label>
          <label className="hiring-field-wide">User goal / north star<input value={map.goal} onChange={(event) => update("goal", event.target.value)} /></label>
        </div>
        <div className="panel-heading">
          <span className="form-message">Drag any story card from one cell to another. Click "+ Story" inside a cell to add new ones.</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="secondary-button" onClick={addStage}><Plus size={16} /> Stage</button>
            <button className="secondary-button" onClick={addRelease}><Plus size={16} /> Release</button>
          </div>
        </div>
      </section>

      <section className="calculator-panel" data-testid="story-map-grid-panel">
        <div className="story-map-wrap">
          <div className="story-map-grid" style={{ gridTemplateColumns: `120px repeat(${map.stages.length}, minmax(180px, 1fr))` }}>
            <div className="story-map-corner">Releases ↓ / Stages →</div>
            {map.stages.map((stage) => (
              <div key={stage.id} className="story-map-stage-head">
                <input value={stage.label} onChange={(event) => updateStage(stage.id, event.target.value)} />
                <button className="icon-button" onClick={() => removeStage(stage.id)} disabled={map.stages.length === 1} aria-label="Remove stage"><Trash2 size={14} /></button>
              </div>
            ))}

            {map.releases.map((release) => (
              <RowSlice
                key={release.id}
                release={release}
                stages={map.stages}
                cellStories={cellStories}
                draggedId={draggedId}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                allowDrop={allowDrop}
                addStory={addStory}
                updateStory={updateStory}
                removeStory={removeStory}
                updateRelease={updateRelease}
                removeRelease={removeRelease}
                releasesCount={map.releases.length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Map preview</h2>
        <div id={previewId} className="hiring-document" data-testid="story-map-preview">
          <header>
            <p className="eyebrow">User Story Map</p>
            <h1>{map.productName}</h1>
            <p>{map.goal}</p>
          </header>
          {map.releases.map((release) => (
            <div key={release.id}>
              <h3>{release.label}</h3>
              <ul>
                {map.stages.map((stage) => {
                  const stories = cellStories(stage.id, release.id);
                  if (stories.length === 0) return null;
                  return (
                    <li key={stage.id}><strong>{stage.label}:</strong> {stories.map((s) => s.label).join(" · ")}</li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="story-map-builder" />
    </div>
  );
}

function RowSlice({ release, stages, cellStories, draggedId, onDragStart, onDragEnd, onDrop, allowDrop, addStory, updateStory, removeStory, updateRelease, removeRelease, releasesCount }) {
  return (
    <>
      <div className="story-map-release-head">
        <input value={release.label} onChange={(event) => updateRelease(release.id, event.target.value)} />
        <button className="icon-button" onClick={() => removeRelease(release.id)} disabled={releasesCount === 1} aria-label="Remove release"><Trash2 size={14} /></button>
      </div>
      {stages.map((stage) => {
        const stories = cellStories(stage.id, release.id);
        return (
          <div
            key={stage.id}
            className="story-map-cell"
            onDragOver={allowDrop}
            onDrop={() => onDrop(stage.id, release.id)}
            data-testid={`cell-${stage.id}-${release.id}`}
          >
            {stories.map((story) => (
              <div
                key={story.id}
                className={`story-card ${draggedId === story.id ? "dragging" : ""}`}
                draggable
                onDragStart={() => onDragStart(story.id)}
                onDragEnd={onDragEnd}
                data-testid={`story-${story.id}`}
              >
                <input value={story.label} onChange={(event) => updateStory(story.id, event.target.value)} />
                <button className="icon-button mini" onClick={() => removeStory(story.id)} aria-label="Remove story"><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="text-button add-story" onClick={() => addStory(stage.id, release.id)}>+ Story</button>
          </div>
        );
      })}
    </>
  );
}
