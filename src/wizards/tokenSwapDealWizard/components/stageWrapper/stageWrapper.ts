import { bindable } from "aurelia-typed-observable-plugin";
import "./stageWrapper.scss";

export class stageWrapper {
  @bindable title: string;
  @bindable wizardManager: any;
  @bindable showSubmit = false;
}
