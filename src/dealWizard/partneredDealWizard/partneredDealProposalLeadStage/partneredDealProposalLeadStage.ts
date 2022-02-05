import { autoinject } from "aurelia-framework";
import { IWizardState, WizardService } from "../../../services/WizardService";
import { validateTrigger, ValidationController, ValidationControllerFactory } from "aurelia-validation";
import { getErrorsFromValidateResults, proposalLeadValidationRules } from "../../validation";
import { IBaseWizardStage, IStageMeta } from "../../dealWizardTypes";
import { IDealRegistrationData } from "../../../entities/DealRegistrationData";

@autoinject
export class PartneredDealProposalLeadStage implements IBaseWizardStage {
  public wizardManager: any;
  public wizardState: IWizardState<IDealRegistrationData>;
  public errors: Record<string, string> = {};
  public form: ValidationController;

  constructor(public wizardService: WizardService, validationFactory: ValidationControllerFactory) {
    this.form = validationFactory.createForCurrentScope();
    // this.form.addRenderer(new PrimeRenderer);
    this.form.validateTrigger = validateTrigger.change;
  }

  activate(stageMeta: IStageMeta): void {
    this.wizardManager = stageMeta.wizardManager;
  }

  attached(): void {
    this.wizardState = this.wizardService.getWizardState(this.wizardManager);
    this.form.addObject(this.wizardState.registrationData.proposalLead, proposalLeadValidationRules.rules);

    this.form.subscribe(event => {
      this.errors = getErrorsFromValidateResults(event.results);
    });

    this.wizardService.registerStageValidateFunction(this.wizardManager, () => {
      return this.form.validate().then(result => result.valid);
    });
  }
}