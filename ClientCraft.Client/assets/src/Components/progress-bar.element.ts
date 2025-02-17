import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { property, css, html, LitElement, repeat } from '@umbraco-cms/backoffice/external/lit';

interface Stage {
    id: number;
    order: number;
    label: string;
}
export class ProgressBar extends UmbElementMixin(LitElement) {
    
    @property()
    public stages: Stage[];
    @property()
    public currentStage?: Stage;
    @property()
    public title: string;
    
    constructor() {
        super();
        this.stages = [];
        this.currentStage = undefined;
        this.title = 'Progress';
    }

    static styles = css`
        .stepper {
            color: white;
            text-wrap: nowrap;
            display: flex;
            list-style: none;
            position: relative;
            padding-left: 20px;
            text-align: center;
        }
        
        .stepper__item {
            flex: 100%;
            padding: 10px 30px 10px 30px;
            background: grey;
            margin: 0 0 0 -19px;
            -webkit-clip-path: polygon(20px 50%, 0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%);

            &:hover {
                cursor: pointer;   
            }
            
            &.current {
                background: var(--uui-color-positive);
                font-weight: bold;
            }

            &.complete {
                background: color-mix(in srgb, white 50%, var(--uui-color-positive-standalone));
            }

            &:first-child {
                border-bottom-left-radius: 2rem;
                border-top-left-radius: 2rem;
                padding-left: 20px;
                -webkit-clip-path: polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%);
            }

            &:last-child {
                border-bottom-right-radius: 2rem;
                border-top-right-radius: 2rem;
                padding-left: 30px;
                -webkit-clip-path: polygon(20px 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%);
            }
        }
  `;

    public emitClickEvent(stage: Stage) {
        let event = new CustomEvent('stage-clicked', {
            detail: {
                stage
            }
        });
        
        this.dispatchEvent(event);
    }
    public getStageStatus(stage: Stage) {
        if (stage.id === this.currentStage?.id) {
            return 'current'            
        }
        
        if (this.currentStage?.order && stage.order < this.currentStage?.order) {
            return 'complete';
        }
        
        return '';
    }
    render() {
        return html`
            <ul class="stepper">
                ${repeat(
                        this.stages,
                        (stage) => html`<li @click="${() => this.emitClickEvent(stage)}" class="stepper__item ${this.getStageStatus(stage)}">${stage.label}</li>`
                )}
            </ul>
    `;
    }
}

customElements.define('progress-bar', ProgressBar);
declare global {
    interface HtmlElementTagNameMap {
        'progress-bar': ProgressBar
    }
}