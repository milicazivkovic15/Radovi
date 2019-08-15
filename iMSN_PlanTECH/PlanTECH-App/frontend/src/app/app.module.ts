import { BrowserModule } from '@angular/platform-browser';
import 'hammerjs';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { LoginComponent } from './default/login/login.component'
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing_module.module';
import { LoginService } from './default/login/login.service';
import { AdministratorComponent } from './administrator-component/administrator-component.component';
import { AgronomistComponent } from './agronomist-component/agronomist-component.component';
import * as Admin from './administrator-component/menu/menu.component';
import * as Agronom from './agronomist-component/menu/menu.component';
import * as Owner from './owner-component/menu/menu.component';
import * as User from './user-component/menu/menu.component';
import * as Default from './default/menu/menu.component';
import { SupportTicketComponent } from './administrator-component/support-ticket/support-ticket.component';
import { RegisterAgronomistComponent } from './administrator-component/register-agronomist/register-agronomist.component';
import { PaymentValidationComponent } from './administrator-component/payment-validation/payment-validation.component';
import { EditRulesComponent } from './shared/edit-rules/edit-rules.component';
import { OwnerComponent } from './owner-component/owner-component.component';
import { PlotsComponent } from './shared/plots/plots.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { EditPermissionsComponent } from './owner-component/edit-permissions/edit-permissions.component';
import { RegisterUserComponent } from './owner-component/register-user/register-user.component';
import { UserComponent } from './user-component/user-component.component';
import { SubmitTicketComponent } from './shared/submit-ticket/submit-ticket.component';
import * as SupportTicketForm from './administrator-component/support-ticket/form/form.component';
import { PopupWindowComponent } from './shared/popup-window/popup-window.component';
import { ImageZoomComponent } from './administrator-component/payment-validation/image-zoom/image-zoom.component';
import { DefaultComponent } from './default/default.component';
import { UserEditComponent } from './administrator-component/user-edit/user-edit.component';
import * as UserEditForm from './administrator-component/user-edit/form/form.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { PermissionFormComponent } from './owner-component/edit-permissions/permission-form/permission-form.component';
import { PreviewComponent } from './default/preview/preview.component';
import { GeneralMapComponent } from './shared/plots/general-map/general-map.component';
import { AddPlotComponent } from './shared/plots/add-plot/add-plot.component';
import { PlotComponent } from './shared/plots/plot/plot.component';
import { SideMenuComponent } from './shared/plots/side-menu/side-menu.component';
import { MapComponent } from './shared/plots/plot/map/map.component';
import { BlankComponent } from './shared/plots/blank/blank.component';
import { EditCulturesService } from './shared/edit-cultures/edit-cultures.service';
import { Ng2MapModule } from 'ng2-map';
import { InsertComponent } from './shared/edit-cultures/insert/insert.component';
import { SubCulturesComponent } from './shared/edit-cultures/sub-cultures/sub-cultures.component';
import { YesNoDialogComponent } from './shared/popup-window/yes-no-dialog/yes-no-dialog.component';
import { TodaysWeatherComponent } from './shared/plots/plot/todays-weather/todays-weather.component';
import { PlotlyComponent } from "./shared/plotly/plotly.component";
import { UploadComponent } from './default/login/upload/upload.component';
import { RegisteredComponent } from './default/login/registered/registered.component';
import { FileUploader } from 'ng2-file-upload';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { DrawMapComponent } from './shared/plots/add-plot/draw-map/draw-map.component';
import { ForgottenPassComponent } from './default/login/forgotten-pass/forgotten-pass.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { ProfileService } from './shared/profile/profile.service';
import { MaterialModule, MdIconModule, MdIconRegistry, MdButtonModule } from '@angular/material';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { PriceComponent } from './default/price/price.component';
import * as DefaultFooter from './default/footer/footer.component';
import * as OtherFooter from './shared/footer/footer.component';
import { UpdateRuleComponent } from './shared/edit-rules/update-rule/update-rule.component';
import { AddRuleComponent } from './shared/edit-rules/add-rule/add-rule.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { CustomFormsModule } from 'ng2-validation';
import { MdCheckboxModule } from '@angular/material';
import { MdCardModule } from '@angular/material/card';
import { EditCulturesComponent } from './shared/edit-cultures/edit-cultures.component';
import { SensorDataGraphicComponent } from './shared/plots/plot/sensor-data-graphic/sensor-data-graphic.component';
import { MenuService } from './owner-component/menu/menu.service';
import { ExpertService } from './owner-component/expert.service';
import { ToastyModule } from 'ng2-toasty';
import { AddSensorComponent } from './shared/plots/add-sensor/add-sensor.component';
import { SensorComponent } from './shared/plots/sensor/sensor.component';
import * as AddSensor from './shared/plots/add-sensor/sensor-map/sensor-map.component';
import * as Sensor from './shared/plots/sensor/sensor-map/sensor-map.component';
import { MobileComponent } from './shared/mobile/mobile.component';
import { ChartsModule } from 'ng2-charts';
import { CornyComponent } from './shared/corny/corny.component';
import { AddRuleAgrComponent } from './shared/edit-rules/add-rule-agr/add-rule-agr.component';
import { UpdateRuleAgrComponent } from './shared/edit-rules/update-rule-agr/update-rule-agr.component';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { DatePickerModule } from 'ng2-datepicker';
import { TypeChangeComponent } from './shared/profile/type-change/type-change.component';
@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    BlankComponent,
    EditCulturesComponent,
    LoginComponent,
    AdministratorComponent,
    AgronomistComponent,
    Admin.MenuComponent,
    Agronom.MenuComponent,
    Owner.MenuComponent,
    User.MenuComponent,
    Default.MenuComponent,
    SupportTicketComponent,
    RegisterAgronomistComponent,
    PaymentValidationComponent,
    EditRulesComponent,
    OwnerComponent,
    PlotsComponent,
    NotificationsComponent,
    EditPermissionsComponent,
    RegisterUserComponent,
    UserComponent,
    SubmitTicketComponent,
    SupportTicketForm.FormComponent,
    PopupWindowComponent,
    ImageZoomComponent,
    DefaultComponent,
    UserEditComponent,
    UserEditForm.FormComponent,
    PermissionFormComponent,
    PreviewComponent,
    GeneralMapComponent,
    AddPlotComponent,
    PlotComponent,
    SideMenuComponent,
    MapComponent,
    InsertComponent,
    SubCulturesComponent,
    YesNoDialogComponent,
    TodaysWeatherComponent,
    PlotlyComponent,
    UploadComponent,
    RegisteredComponent,
    FileSelectDirective,
    FileDropDirective,
    DrawMapComponent,
    ForgottenPassComponent,
    ProfileComponent,
    PriceComponent,
    DefaultFooter.FooterComponent,
    OtherFooter.FooterComponent,
    UpdateRuleComponent,
    AddRuleComponent,
    SensorDataGraphicComponent,
    AddSensorComponent,
    SensorComponent,
    AddSensor.SensorMapComponent,
    Sensor.SensorMapComponent,
    MobileComponent,
    CornyComponent,
    AddRuleAgrComponent,
    UpdateRuleAgrComponent,
    TypeChangeComponent,
  ],
  imports: [
    DatePickerModule,
    NKDatetimeModule,
    ChartsModule,
    MdCheckboxModule,
    MdButtonModule,
    MdCardModule,
    BrowserModule,
    MaterialModule,
    CustomFormsModule,
    MdIconModule,
    Angular2FontawesomeModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    NgxPaginationModule,
    Ng2AutoCompleteModule,
    Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyDMqBpWsaFzuGIm8y3ryKvrjbxpAwZ3oIo' }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: AppModule.useFactoryFunction,
      deps: [Http]
    }),
    ToastyModule.forRoot()
  ],
  providers: [
    LoginService,
    EditCulturesService,
    ProfileService,
    MdIconRegistry,
    MenuService,
    ExpertService
  ],
  entryComponents: [
    TypeChangeComponent,
    PopupWindowComponent,
    SupportTicketForm.FormComponent,
    ImageZoomComponent,
    UserEditForm.FormComponent,
    PermissionFormComponent,
    InsertComponent,
    SubCulturesComponent,
    YesNoDialogComponent,
    UploadComponent,
    RegisteredComponent,
    ForgottenPassComponent,
    UpdateRuleComponent,
    AddRuleComponent,
    CornyComponent,
    AddRuleAgrComponent,
    UpdateRuleAgrComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule {

  static useFactoryFunction(http: Http) {

    return new TranslateStaticLoader(http, '/src/i18n', '.json')
  }
}