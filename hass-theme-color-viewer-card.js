/**
 * Home Assistant Theme Color Viewer Card
 * A custom card that displays Home Assistant theme CSS variables with their colors
 */

const VERSION = "1.1.4";

import {
    LitElement,
    html,
    css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

// Standard Home Assistant theme CSS variables that return color values
const HA_THEME_COLOR_VARIABLES = [
    "--primary-background-color",
    "--secondary-background-color",
    "--sidebar-background-color",
    "--card-background-color",
    "--dark-primary-color",
    "--primary-color",
    "--light-primary-color",
    "--accent-color",
    "--ha-card-header-color",
    "--ha-card-border-color",
    "--primary-text-color",
    "--secondary-text-color",
    "--text-primary-color",
    "--disabled-text-color",
    "--state-active-color",
    "--state-inactive-color",
    "--divider-color",
    "--scrollbar-thumb-color",
    "--app-header-background-color",
    "--app-header-text-color",
    "--app-header-selection-background-color",
    "--app-header-edit-background-color",
    "--app-header-edit-text-color",
    "--dialog-background-color",
    "--input-fill-color",
    "--input-ink-color",
    "--input-label-ink-color",
    "--input-disabled-fill-color",
    "--input-disabled-ink-color",
    "--input-dropdown-icon-color",
    "--input-hover-fill-color",
    "--input-idle-line-color",
    "--input-disabled-line-color",
    "--material-background-color",
    "--material-secondary-background-color",
    "--material-secondary-text-color",
    "--material-divider-color",
    "--mdc-theme-primary",
    "--mdc-theme-secondary",
    "--mdc-theme-background",
    "--mdc-theme-surface",
    "--mdc-theme-error",
    "--mdc-theme-on-primary",
    "--mdc-theme-on-secondary",
    "--mdc-theme-on-surface",
    "--mdc-theme-on-error",
    "--paper-item-icon-color",
    "--paper-item-icon-active-color",
    "--paper-slider-knob-color",
    "--paper-slider-knob-start-color",
    "--paper-slider-pin-color",
    "--paper-slider-active-color",
    "--paper-slider-secondary-color",
    "--switch-checked-color",
    "--switch-unchecked-color",
    "--switch-unchecked-button-color",
    "--switch-unchecked-track-color",
    "--table-row-background-color",
    "--table-row-alternative-background-color",
    "--data-table-background-color",
    "--markdown-code-background-color",
    "--rgb-primary-color",
    "--rgb-accent-color",
    "--rgb-state-active-color",
    "--rgb-state-inactive-color",
    "--rgb-state-alarm-armed-color",
    "--rgb-state-alarm-triggered-color",
    "--rgb-red-color",
    "--rgb-pink-color",
    "--rgb-purple-color",
    "--rgb-deep-purple-color",
    "--rgb-indigo-color",
    "--rgb-blue-color",
    "--rgb-light-blue-color",
    "--rgb-cyan-color",
    "--rgb-teal-color",
    "--rgb-green-color",
    "--rgb-light-green-color",
    "--rgb-lime-color",
    "--rgb-yellow-color",
    "--rgb-amber-color",
    "--rgb-orange-color",
    "--rgb-deep-orange-color",
    "--rgb-brown-color",
    "--rgb-grey-color",
    "--rgb-blue-grey-color",
    "--rgb-white-color",
    "--rgb-black-color",
    "--rgb-disabled-color",
];

// Default variables to pre-populate
const DEFAULT_VARIABLES = [
    "--primary-background-color",
    "--secondary-background-color",
    "--sidebar-background-color",
    "--card-background-color",
    "--dark-primary-color",
    "--primary-color",
    "--light-primary-color",
    "--accent-color",
    "--ha-card-header-color",
    "--ha-card-border-color",
    "--primary-text-color",
    "--secondary-text-color",
    "--text-primary-color",
    "--disabled-text-color",
    "--state-active-color",
    "--state-inactive-color",
];

// Validate CSS variable name format
const isValidCssVariable = (value) => {
    if (!value || typeof value !== "string") return false;
    if (!value.startsWith("--")) return false;
    // Check for valid CSS custom property name (letters, numbers, hyphens, underscores)
    const validPattern = /^--[a-zA-Z][a-zA-Z0-9_-]*$/;
    return validPattern.test(value);
};

class HassThemeColorViewerCard extends LitElement {
    static properties = {
        hass: {},
        config: { state: true },
        _variables: { state: true },
        _copiedIndex: { state: true },
    };

    static styles = css`
        :host {
            display: block;
        }

        ha-card {
            padding: 16px;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2em;
            font-weight: 500;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }

        .card-version {
            font-size: 0.6em;
            font-weight: 400;
            color: var(--secondary-text-color, #757575);
        }

        .variables-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            border: 1px solid var(--divider-color, #cccccc);
            border-radius: 8px;
            padding: 8px;
            background: var(--card-background-color, #ffffff);
        }

        .var-color {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60px;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            transition:
                transform 0.2s,
                box-shadow 0.2s;
        }

        .var-color:hover {
            transform: scale(1.01);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .var-color.fallback {
            background-image:
                repeating-linear-gradient(
                    45deg,
                    rgba(255, 0, 0, 0.4),
                    rgba(255, 0, 0, 0.4) 2px,
                    transparent 2px,
                    transparent 15px
                ),
                repeating-linear-gradient(
                    -45deg,
                    rgba(255, 0, 0, 0.4),
                    rgba(255, 0, 0, 0.4) 2px,
                    transparent 2px,
                    transparent 15px
                );
            background-color: #ffffff;
        }

        .var-color-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1;
            text-align: center;
            padding: 8px;
        }

        .var-color-text {
            background: #222222;
            color: #fcfcfc;
            margin: 1px;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.85em;
            word-break: break-all;
        }

        .var-color-value {
            background: rgba(34, 34, 34, 0.85);
            color: #fcfcfc;
            margin: 2px 1px 1px 1px;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.75em;
            word-break: break-all;
        }

        .copy-button {
            position: absolute;
            bottom: 4px;
            right: 4px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(34, 34, 34, 0.7);
            color: #fcfcfc;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            z-index: 2;
        }

        .copy-button:hover {
            background: rgba(34, 34, 34, 0.9);
        }

        .copy-button ha-icon {
            --mdc-icon-size: 16px;
        }

        .copy-button.copied {
            background: rgba(76, 175, 80, 0.9);
        }
    `;

    constructor() {
        super();
        this._variables = [...DEFAULT_VARIABLES];
        this._copiedIndex = null;
    }

    setConfig(config) {
        this.config = config;
        if (config.variables && Array.isArray(config.variables)) {
            this._variables = [...config.variables];
        } else {
            this._variables = [...DEFAULT_VARIABLES];
        }
    }

    static getConfigElement() {
        return document.createElement("hass-theme-color-viewer-card-editor");
    }

    static getStubConfig() {
        return {
            title: "Theme Colors",
            variables: [...DEFAULT_VARIABLES],
        };
    }

    _getComputedColor(variable) {
        if (!this.hass) return null;
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const value = computedStyle.getPropertyValue(variable).trim();
        return value || null;
    }

    _isColorDefined(variable) {
        const color = this._getComputedColor(variable);
        return color !== null && color !== "";
    }

    async _copyToClipboard(text, index) {
        try {
            await navigator.clipboard.writeText(text);
            this._copiedIndex = index;
            setTimeout(() => {
                this._copiedIndex = null;
                this.requestUpdate();
            }, 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }

    render() {
        if (!this.config) {
            return html`<ha-card>No configuration</ha-card>`;
        }

        const title = this.config.title || "Theme Colors";
        const variables = this.config.variables || this._variables;

        return html`
            <ha-card>
                <div class="card-header">
                    <span>${title}</span>
                    <span class="card-version">v${VERSION}</span>
                </div>
                <div class="variables-container">
                    ${variables.map(
                        (variable, index) => html`
                            ${this._renderVariableItem(variable, index)}
                        `,
                    )}
                </div>
            </ha-card>
        `;
    }

    _renderVariableItem(variable, index) {
        const isDefined = this._isColorDefined(variable);
        const colorValue = this._getComputedColor(variable);
        const isCopied = this._copiedIndex === index;

        return html`
            <div
                class="var-color ${isDefined ? "" : "fallback"}"
                style="${isDefined
                    ? `background: var(${variable}, transparent);`
                    : ""}">
                <div class="var-color-content">
                    <span class="var-color-text">${variable}</span>
                    ${colorValue
                        ? html`<span class="var-color-value"
                              >${colorValue}</span
                          >`
                        : ""}
                </div>
                <button
                    class="copy-button ${isCopied ? "copied" : ""}"
                    @click=${() => this._copyToClipboard(variable, index)}
                    title="Copy variable name">
                    <ha-icon
                        .icon=${isCopied
                            ? "mdi:check"
                            : "mdi:content-copy"}></ha-icon>
                </button>
            </div>
        `;
    }

    getCardSize() {
        const variables = this.config?.variables || this._variables;
        return 1 + variables.length;
    }
}

// Editor component
class HassThemeColorViewerCardEditor extends LitElement {
    static properties = {
        hass: {},
        config: { state: true },
        _variables: { state: true },
        _draggedIndex: { state: true },
        _dragOverIndex: { state: true },
        _showAddDialog: { state: true },
        _dialogInputValue: { state: true },
        _dialogDropdownValue: { state: true },
        _dialogValidationError: { state: true },
    };

    static styles = css`
        .editor-container {
            padding: 16px;
        }

        .editor-header {
            font-size: 1.1em;
            font-weight: 500;
            margin-bottom: 16px;
        }

        .variable-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 16px;
        }

        .variable-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border-radius: 4px;
            border: 1px solid var(--divider-color, #e0e0e0);
            transition:
                background 0.2s,
                border-color 0.2s;
        }

        .variable-item.dragging {
            opacity: 0.5;
        }

        .variable-item.drag-over {
            border-color: var(--primary-color, #03a9f4);
            border-width: 2px;
        }

        .drag-handle {
            cursor: grab;
            color: var(--secondary-text-color, #757575);
            display: flex;
            align-items: center;
        }

        .drag-handle:active {
            cursor: grabbing;
        }

        .variable-name {
            flex: 1;
            font-family: monospace;
            font-size: 0.95em;
            color: var(--primary-text-color, #212121);
            padding: 4px 8px;
        }

        .remove-button {
            color: var(--error-color, #db4437);
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .add-section {
            display: flex;
            justify-content: center;
            padding-top: 16px;
            border-top: 1px solid var(--divider-color, #e0e0e0);
        }

        .color-preview {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid var(--divider-color, #e0e0e0);
            flex-shrink: 0;
        }

        .color-preview.fallback {
            background-image:
                repeating-linear-gradient(
                    45deg,
                    rgba(255, 0, 0, 0.4),
                    rgba(255, 0, 0, 0.4) 2px,
                    transparent 2px,
                    transparent 8px
                ),
                repeating-linear-gradient(
                    -45deg,
                    rgba(255, 0, 0, 0.4),
                    rgba(255, 0, 0, 0.4) 2px,
                    transparent 2px,
                    transparent 8px
                );
            background-color: #ffffff;
        }

        /* Dialog styles */
        .dialog-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
        }

        .dialog-input-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .dialog-divider {
            display: flex;
            align-items: center;
            gap: 16px;
            color: var(--secondary-text-color, #757575);
            font-size: 0.9em;
        }

        .dialog-divider::before,
        .dialog-divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--divider-color, #e0e0e0);
        }

        .dialog-validation-error {
            color: var(--error-color, #db4437);
            font-size: 0.85em;
            margin-top: 4px;
        }

        ha-textfield,
        ha-select {
            display: block;
            width: 100%;
        }
    `;

    constructor() {
        super();
        this._variables = [...DEFAULT_VARIABLES];
        this._draggedIndex = null;
        this._dragOverIndex = null;
        this._showAddDialog = false;
        this._dialogInputValue = "";
        this._dialogDropdownValue = "";
        this._dialogValidationError = "";
    }

    setConfig(config) {
        this.config = config;
        if (config.variables && Array.isArray(config.variables)) {
            this._variables = [...config.variables];
        } else {
            this._variables = [...DEFAULT_VARIABLES];
        }
    }

    _getComputedColor(variable) {
        if (!this.hass) return null;
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const value = computedStyle.getPropertyValue(variable).trim();
        return value || null;
    }

    _isColorDefined(variable) {
        const color = this._getComputedColor(variable);
        return color !== null && color !== "";
    }

    _fireConfigChanged() {
        const event = new CustomEvent("config-changed", {
            detail: {
                config: {
                    ...this.config,
                    variables: [...this._variables],
                },
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    _removeVariable(index) {
        const newVariables = this._variables.filter((_, i) => i !== index);
        this._variables = newVariables;
        this._fireConfigChanged();
    }

    // Drag and drop handlers
    _handleDragStart(index) {
        this._draggedIndex = index;
    }

    _handleDragOver(e, index) {
        e.preventDefault();
        if (this._draggedIndex !== null && this._draggedIndex !== index) {
            this._dragOverIndex = index;
        }
    }

    _handleDragLeave() {
        this._dragOverIndex = null;
    }

    _handleDrop(index) {
        if (this._draggedIndex !== null && this._draggedIndex !== index) {
            const newVariables = [...this._variables];
            const draggedItem = newVariables[this._draggedIndex];
            newVariables.splice(this._draggedIndex, 1);
            newVariables.splice(index, 0, draggedItem);
            this._variables = newVariables;
            this._fireConfigChanged();
        }
        this._draggedIndex = null;
        this._dragOverIndex = null;
    }

    _handleDragEnd() {
        this._draggedIndex = null;
        this._dragOverIndex = null;
    }

    _handleTitleChange(value) {
        const event = new CustomEvent("config-changed", {
            detail: {
                config: {
                    ...this.config,
                    title: value,
                },
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    // Dialog handlers
    _openAddDialog() {
        this._dialogInputValue = "";
        this._dialogDropdownValue = "";
        this._dialogValidationError = "";
        this._showAddDialog = true;
    }

    _closeAddDialog() {
        this._showAddDialog = false;
        this._dialogInputValue = "";
        this._dialogDropdownValue = "";
        this._dialogValidationError = "";
    }

    _handleDialogInput(e) {
        this._dialogInputValue = e.target.value;
        this._dialogValidationError = "";
        // Clear dropdown when typing
        if (this._dialogInputValue) {
            this._dialogDropdownValue = "";
        }
    }

    _handleDialogDropdownSelect(e) {
        this._dialogDropdownValue = e.target.value;
        this._dialogValidationError = "";
        // Clear text input when selecting from dropdown
        if (this._dialogDropdownValue) {
            this._dialogInputValue = "";
        }
    }

    _confirmAddVariable() {
        const newValue = this._dialogInputValue || this._dialogDropdownValue;

        if (!newValue) {
            this._dialogValidationError = "Please enter or select a variable";
            return;
        }

        if (!isValidCssVariable(newValue)) {
            this._dialogValidationError =
                'Variable must start with "--" and contain only letters, numbers, hyphens, and underscores';
            return;
        }

        if (this._variables.includes(newValue)) {
            this._dialogValidationError =
                "This variable is already in the list";
            return;
        }

        this._variables = [...this._variables, newValue];
        this._fireConfigChanged();
        this._closeAddDialog();
    }

    render() {
        if (!this.config) {
            return html`<div>No configuration</div>`;
        }

        return html`
            <div class="editor-container">
                <div class="editor-header">
                    Theme Color Viewer Configuration
                </div>

                <ha-textfield
                    label="Card Title"
                    .value=${this.config.title || "Theme Colors"}
                    @input=${(e) =>
                        this._handleTitleChange(e.target.value)}></ha-textfield>

                <div
                    style="margin-top: 16px; margin-bottom: 8px; font-weight: 500;">
                    CSS Variables (drag to reorder):
                </div>

                <div class="variable-list">
                    ${this._variables.map(
                        (variable, index) => html`
                            <div
                                class="variable-item ${this._draggedIndex ===
                                index
                                    ? "dragging"
                                    : ""} ${this._dragOverIndex === index
                                    ? "drag-over"
                                    : ""}"
                                draggable="true"
                                @dragstart=${() => this._handleDragStart(index)}
                                @dragover=${(e) =>
                                    this._handleDragOver(e, index)}
                                @dragleave=${() => this._handleDragLeave()}
                                @drop=${() => this._handleDrop(index)}
                                @dragend=${() => this._handleDragEnd()}>
                                <div class="drag-handle">
                                    <ha-icon icon="mdi:drag"></ha-icon>
                                </div>

                                <div
                                    class="color-preview ${this._isColorDefined(
                                        variable,
                                    )
                                        ? ""
                                        : "fallback"}"
                                    style="${this._isColorDefined(variable)
                                        ? `background: var(${variable}, transparent);`
                                        : ""}"></div>

                                <span class="variable-name">${variable}</span>

                                <div
                                    class="remove-button"
                                    @click=${() => this._removeVariable(index)}>
                                    <ha-icon icon="mdi:delete"></ha-icon>
                                </div>
                            </div>
                        `,
                    )}
                </div>

                <div class="add-section">
                    <ha-button @click=${this._openAddDialog}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        Add Variable
                    </ha-button>
                </div>
            </div>

            ${this._renderAddDialog()}
        `;
    }

    _renderAddDialog() {
        // Get available variables (not already in the list)
        const availableVariables = HA_THEME_COLOR_VARIABLES.filter(
            (v) => !this._variables.includes(v),
        );

        return html`
            <ha-dialog
                .open=${this._showAddDialog}
                @closed=${this._closeAddDialog}
                heading="Add CSS Variable">
                
                <div class="dialog-content">
                    <ha-textfield
                        label="Enter CSS Variable"
                        placeholder="e.g., --my-custom-color"
                        .value=${this._dialogInputValue}
                        @input=${this._handleDialogInput}
                        @value-changed=${this._handleDialogInput}></ha-textfield>

                    <div class="dialog-divider">or select from list</div>

                    <ha-select
                        label="Select CSS Variable"
                        .value=${this._dialogDropdownValue}
                        @selected=${this._handleDialogDropdownSelect}
                        @closed=${(e) => e.stopPropagation()}>
                        <mwc-list-item value="">-- Select --</mwc-list-item>
                        ${availableVariables.map(
                            (v) => html`
                                <mwc-list-item .value=${v}>${v}</mwc-list-item>
                            `,
                        )}
                    </ha-select>

                    ${this._dialogValidationError
                        ? html`<ha-alert alert-type="error">
                              ${this._dialogValidationError}
                          </ha-alert>`
                        : ""}
                </div>

                <ha-dialog-footer slot="footer">
                    <mwc-button
                        slot="secondaryAction"
                        dialogAction="cancel"
                        @click=${this._closeAddDialog}>
                        Cancel
                    </mwc-button>
                    <mwc-button
                        slot="primaryAction"
                        @click=${this._confirmAddVariable}>
                        Add
                    </mwc-button>
                </ha-dialog-footer>
            </ha-dialog>
        `;
    }
}

// Register the card
customElements.define("hass-theme-color-viewer-card", HassThemeColorViewerCard);

// Register the editor
customElements.define(
    "hass-theme-color-viewer-card-editor",
    HassThemeColorViewerCardEditor,
);

// Register with Home Assistant card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: "hass-theme-color-viewer-card",
    name: "Theme Color Viewer",
    description: "Display Home Assistant theme CSS variables with their colors",
    preview: true,
    documentationURL:
        "https://github.com/htpchome/hass-theme-color-viewer-card",
});

console.info(
    `%c HASS-THEME-COLOR-VIEWER-CARD %c v${VERSION} `,
    "color: white; background: #03a9f4; font-weight: 700;",
    "color: #03a9f4; background: white; font-weight: 700;",
);
