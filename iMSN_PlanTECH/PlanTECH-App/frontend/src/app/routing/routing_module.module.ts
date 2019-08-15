import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from '../default/login/login.component';
import { AdministratorComponent } from '../administrator-component/administrator-component.component';
import { AgronomistComponent } from '../agronomist-component/agronomist-component.component';
import { OwnerComponent } from '../owner-component/owner-component.component';
import { SupportTicketComponent } from '../administrator-component/support-ticket/support-ticket.component';
import { UserComponent } from '../user-component/user-component.component';
import { RegisterAgronomistComponent } from '../administrator-component/register-agronomist/register-agronomist.component';
import { PaymentValidationComponent } from '../administrator-component/payment-validation/payment-validation.component';
import { UserEditComponent } from '../administrator-component/user-edit/user-edit.component';
import { DefaultComponent } from '../default/default.component';
import { EditPermissionsComponent } from '../owner-component/edit-permissions/edit-permissions.component';

import { NotificationsComponent } from '../shared/notifications/notifications.component';

import { PlotsComponent } from '../shared/plots/plots.component';
import { RegisterUserComponent } from '../owner-component/register-user/register-user.component';
import { PreviewComponent } from '../default/preview/preview.component';
import { EditRulesComponent } from '../shared/edit-rules/edit-rules.component';
import { SubmitTicketComponent } from '../shared/submit-ticket/submit-ticket.component';
import { GeneralMapComponent } from '../shared/plots/general-map/general-map.component';
import { AddPlotComponent } from '../shared/plots/add-plot/add-plot.component';
import { PlotComponent } from '../shared/plots/plot/plot.component';
import { BlankComponent } from '../shared/plots/blank/blank.component';
import { AddSensorComponent } from '../shared/plots/add-sensor/add-sensor.component';
import { SensorComponent } from '../shared/plots/sensor/sensor.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { EditCulturesComponent } from '../shared/edit-cultures/edit-cultures.component';
import { MobileComponent } from "../shared/mobile/mobile.component";

const routes: Routes = [
  { path: '', redirectTo: '/PlanTECH', pathMatch: 'full' },
  { path: 'mobile',  component: MobileComponent },
  { path: 'PlanTECH',  component: DefaultComponent},	
	{ path: 'Admin',  component: AdministratorComponent, children: [
	{ path: '', redirectTo: '/Admin/novi-korisnici', pathMatch: 'full' },
	{ path: '_blank', component: BlankComponent },
    { path: 'dodaj-korisnika',  component: RegisterAgronomistComponent },
    { path: 'tehnicka-podrska', component:SupportTicketComponent},
    { path: 'novi-korisnici', component:PaymentValidationComponent},
    { path: 'izmena-podataka', component:UserEditComponent},
	{ path: 'profil', component: ProfileComponent},
  ]},
	{ path: 'Agronom',  component: AgronomistComponent , children: [
		{ path: '', redirectTo: '/Agronom/izmena-pravila', pathMatch: 'full' },	
		{ path: '_blank', component: BlankComponent },
		{ path: 'izmena-pravila',  component: EditRulesComponent },
		{ path: 'korisnicka-podrska', component:SubmitTicketComponent},
		{ path: 'profil', component: ProfileComponent},
		{ path: 'izmena-kultura', component:EditCulturesComponent},
	]},
  { path: 'Vlasnik', component: OwnerComponent, children: [
		{ path: '', redirectTo: '/Vlasnik/plantaze', pathMatch: 'full' },
		{ path: '_blank', component: BlankComponent },
		{ path: 'obavestenja', component:NotificationsComponent},
		{ path: 'nove-kulture', component:EditCulturesComponent},
		{ path: 'profil', component: ProfileComponent},
		{ path: 'plantaze', component:PlotsComponent, children: [
			{path: '', component: GeneralMapComponent },
			{path: 'nova', component: AddPlotComponent },
			{path: 'plantaza', component: PlotComponent },
			{path: 'novi-senzor', component: AddSensorComponent },
			{path: 'senzor', component: SensorComponent },
			{path: '_blank', component: BlankComponent }
		]},
		{ path: 'izmena-pravila', component:EditRulesComponent},  
		{ path: 'korisnicka-podrska', component:SubmitTicketComponent},
		{ path: 'dodaj-korisnika', component:RegisterUserComponent},
  ]}, 
  { path: 'Korisnik', component: UserComponent,	children: [
		{path: '', redirectTo: '/Korisnik/plantaze', pathMatch: 'full' },
		{ path: '_blank', component: BlankComponent },
  		{ path: 'plantaze', component: PlotsComponent, children: [
    		{path: '', component: GeneralMapComponent },
     		{path: 'nova', component: AddPlotComponent },
     		{path: 'plantaza', component: PlotComponent },
     		{path: '_blank', component: BlankComponent },
			{path: 'novi-senzor', component: AddSensorComponent },
			{path: 'senzor', component: SensorComponent },
		]},
		{ path: 'profil', component: ProfileComponent},
		{ path: 'obavestenja', component:NotificationsComponent},
		{ path: 'nove-kulture', component:EditCulturesComponent},
		{ path: 'izmena-pravila', component:EditRulesComponent},    
		{ path: 'tehnicka-podrska', component:SubmitTicketComponent},
	]}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]

})
export class RoutingModule { 
	
}
