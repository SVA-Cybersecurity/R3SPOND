function togglesteps(event) {
    event.preventDefault();
    let subMenu = event.target.nextElementSibling;
    if (subMenu) {
        subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    }
}

function collapseAllSubsteps() {
    // Collapse all substep-cells and remove active class from expand handles
    document.querySelectorAll('.substep-cell').forEach(substep => {
        substep.style.display = "none";
    });
    document.querySelectorAll('.expand-handle').forEach(handle => {
        handle.classList.remove('expand-handle--active');
        handle.innerHTML = '&#43';
    });
}

function expandAllSubsteps() {
    // Expand all substep-cells and add active class to expand handles
    document.querySelectorAll('.substep-cell').forEach(substep => {
        substep.style.display = "block";
    });
    document.querySelectorAll('.expand-handle').forEach(handle => {
        handle.classList.add('expand-handle--active');
        handle.innerHTML = '&#8722';
    });
}

function translate(key) {
    if (!window.translations) {
        console.warn("Translations not loaded");
        return key;
    }

    const parts = key.split('.');
    let value = window.translations;

    for (let i = 0; i < parts.length; i++) {
        const k = parts[i];
        if (value !== null && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return `[${key} not found]`;
        }
    }

    return value;
}

/**
 Matrix Toolbar
*/

let matrixTagFilterState = {}; // tag: true/false

function ensureMatrixControls(allTags, onTagFilterChange) {
    let container = document.querySelector('.matrix-container');
    let controls = document.querySelector('.matrix-toolbar');
    if (!controls) {
        controls = document.createElement('div');
        controls.className = 'matrix-toolbar';

        // Hide all button
        let collapseBtn = document.createElement('button');
        collapseBtn.type = 'button';
        collapseBtn.innerText = translate('index.matrix.toolbar.collapse_all');
        collapseBtn.title = translate('index.matrix.toolbar.collapse_all_title');
        collapseBtn.onclick = collapseAllSubsteps;
        controls.appendChild(collapseBtn);

        // Expand all button
        let expandBtn = document.createElement('button');
        expandBtn.type = 'button';
        expandBtn.innerText = translate('index.matrix.toolbar.expand_all');
        expandBtn.title = translate('index.matrix.toolbar.expand_all_title');
        expandBtn.style.marginLeft = '12px';
        expandBtn.onclick = expandAllSubsteps;
        controls.appendChild(expandBtn);

        // Tag filter controls
        let filterLabel = document.createElement('span');
        filterLabel.innerText = 'Filter:';
        filterLabel.style.marginLeft = '18px';
        filterLabel.style.fontWeight = 'bold';
        controls.appendChild(filterLabel);

        // Reset filters button
        let resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.innerText = translate('index.matrix.toolbar.reset_filters');
        resetBtn.title = translate('index.matrix.toolbar.reset_filters_title');
        resetBtn.style.marginLeft = '12px';
        resetBtn.onclick = function() {
            Object.keys(matrixTagFilterState).forEach(tag => matrixTagFilterState[tag] = false);
            // Update all tag filter buttons
            controls.querySelectorAll('button.matrix-tag-filter-btn').forEach(btn => {
                btn.classList.remove('matrix-tag-filter-btn-active');
                btn.title = translate('index.matrix.toolbar.tag_filter_title');
            });
            if (typeof onTagFilterChange === 'function') onTagFilterChange();
        };
        controls.appendChild(resetBtn);



        allTags.forEach(tag => {
            // Initial state: no tag active
            if (!(tag in matrixTagFilterState)) matrixTagFilterState[tag] = false;

            let tagBtn = document.createElement('button');
            tagBtn.type = 'button';
            tagBtn.innerText = tag;
            tagBtn.title = translate('index.matrix.toolbar.tag_filter_title');
            tagBtn.className = 'matrix-tag-filter-btn';
            tagBtn.setAttribute('data-tag', tag);
            tagBtn.style.marginLeft = '6px';
            if (matrixTagFilterState[tag]) {
                tagBtn.classList.add('matrix-tag-filter-btn-active');
            }
            tagBtn.onclick = function() {
                matrixTagFilterState[tag] = !matrixTagFilterState[tag];
                if (!matrixTagFilterState[tag]) {
                    tagBtn.classList.remove('matrix-tag-filter-btn-active');
                    tagBtn.title = translate('index.matrix.toolbar.tag_filter_title');
                } else {
                    tagBtn.classList.add('matrix-tag-filter-btn-active');
                    tagBtn.title = translate('index.matrix.toolbar.tag_filter_active_title');
                }
                if (typeof onTagFilterChange === 'function') onTagFilterChange();
            };
            controls.appendChild(tagBtn);
        });

        container.parentElement.insertBefore(controls, container);
    } else {
        // Update tag filter buttons if already present
        allTags.forEach(tag => {
            let tagBtn = controls.querySelector('button.matrix-tag-filter-btn[data-tag="' + tag + '"]');
            if (tagBtn) {
                if (!matrixTagFilterState[tag]) {
                    tagBtn.classList.remove('matrix-tag-filter-btn-active');
                } else {
                    tagBtn.classList.add('matrix-tag-filter-btn-active');
                }
            }
        });
    }
}

function bootstrapMatrix(phases, steps = [], substeps = []) {
    // Extract all tags
    let allTagsSet = new Set();
    steps.forEach(step => {
        if (Array.isArray(step.tags)) {
            step.tags.forEach(tag => allTagsSet.add(tag));
        }
    });
    let allTags = Array.from(allTagsSet).filter(Boolean);

    // Toolbar/filter controls
    let container = document.querySelector('.matrix-container');
    ensureMatrixControls(allTags, () => bootstrapMatrix(phases, steps, substeps));
    container.innerHTML = '';

    // Matrix rendering with filter
    phases.forEach(phase => {
        let phaseDiv = document.createElement('div');
        phaseDiv.className = 'phase';
        phaseDiv.innerHTML = `<strong><a href="${phase.link}" target="_blank">${phase.id.toUpperCase()}<br>${translate(phase.title)}</a></strong>`;
        phaseDiv.title = phase.id;
        let dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'step-cell';
        dropdownDiv.setAttribute('data-step-id', phase.steps.map(st => {
            let s = steps.find((entry) => entry.content == st);
            return s ? s.id : '';
        }).join(','));
        phase.steps.forEach(step_template => {
            let step = steps.find((entry) => entry.content == step_template);
            if (!step) return;

            // Filter: sho steps, if all its tags are active (or no tag)
            let showStep = true;

            // check if any filter is set to true
            let filterActive = allTags.some(tag => matrixTagFilterState[tag])

            if (Array.isArray(step.tags) && step.tags.length > 0 && filterActive) {
                showStep = step.tags.some(tag => matrixTagFilterState[tag]);
            }
            if (!showStep) return;

            let stepDiv = document.createElement('div');
            stepDiv.style.position = 'relative';
            stepDiv.title = step.id;
            stepDiv.setAttribute('data-step-id', step.id);

            // Hover-Highlight for all cells with same step
            stepDiv.addEventListener('mouseenter', function() {
                document.querySelectorAll('div[data-step-id="' + step.id + '"] > a').forEach(a => {
                    a.style.background = 'var(--md-primary-fg-color)';
                    a.style.color = 'var(--md-matrix-colums-color)';
                });
            });
            stepDiv.addEventListener('mouseleave', function() {
                document.querySelectorAll('div[data-step-id="' + step.id + '"] > a').forEach(a => {
                    a.style.background = '';
                    a.style.color = '';
                });
            });

            let stepLink = document.createElement('a');
            stepLink.href = phase.link + "#" + translate(step.anchor);
            stepLink.innerText = translate(step.title);

            // check for substeps
            let hasSubsteps = step.substeps && step.substeps.length > 0;

            if (hasSubsteps) {
                let expandHandle = document.createElement('span');
                expandHandle.className = 'expand-handle';
                expandHandle.innerHTML = '&#43';
                expandHandle.title = 'Teilschritte anzeigen';

                expandHandle.onclick = function(event) {
                    event.preventDefault();
                    let subMenu = expandHandle.parentElement.querySelector('.substep-cell');
                    if (subMenu) {
                        const expanded = subMenu.style.display === "block";
                        subMenu.style.display = expanded ? "none" : "block";
                        if (expanded) {
                            expandHandle.classList.remove('expand-handle--active');
                            expandHandle.innerHTML = '&#43';
                        } else {
                            expandHandle.classList.add('expand-handle--active');
                            expandHandle.innerHTML = '&#8722';
                        }
                    }
                };

                stepDiv.appendChild(expandHandle);
                stepLink.style.marginLeft = '14px';
                stepDiv.appendChild(stepLink);
            } else {
                stepDiv.appendChild(stepLink);
            }

            let substepDiv = document.createElement('div');
            substepDiv.className = 'substep-cell';
            substepDiv.style.display = "none";
            substepDiv.style.marginLeft = '14px';

            if (hasSubsteps) {
                step.substeps.forEach(sub_template => {
                    let sub = substeps.find((entry) => entry.content == sub_template)
                    if (sub) {
                        let subLink = document.createElement('a');
                        subLink.href = phase.link + "#" + translate(step.anchor);
                        subLink.innerText = translate(sub.title);
                        subLink.title = sub.id;
                        substepDiv.appendChild(subLink);
                    }
                });
            }
            stepDiv.appendChild(substepDiv);
            dropdownDiv.appendChild(stepDiv);
        });
        phaseDiv.appendChild(dropdownDiv);
        container.appendChild(phaseDiv);
    });
}