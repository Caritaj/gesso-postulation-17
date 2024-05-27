import { NgModule } from '@angular/core';
import { ScrollToUpDirective } from './scrollToUp.directive';
import { DateInputMaskDirective } from './date-input-mask.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';

@NgModule({
    declarations: [
        ScrollToUpDirective,
        DateInputMaskDirective,
        OnlyNumbersDirective,
    ],
    exports: [
        ScrollToUpDirective,
        DateInputMaskDirective,
        OnlyNumbersDirective,
    ]
})
export class DirectivesModule { }
