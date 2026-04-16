import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing').then(m => m.Landing)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then(m => m.Register)
  },
  {
  path: 'register/patient',
  loadComponent: () =>
    import('./patient-register/patient-register').then(m => m.PatientRegister)
},
{
  path: 'register/doctor',
  loadComponent: () =>
    import('./doctor-register/doctor-register')
      .then(m => m.DoctorRegister)
},
{
  path: 'patient-dashboard',
  loadComponent: () =>
    import('./patient-dashboard/patient-dashboard')
      .then(m => m.PatientDashboard)
},
{
  path: 'book-appointment',
  loadComponent: () =>
    import('./book-appointment/book-appointment')
      .then(m => m.BookAppointment)
},
{
  path: 'my-appointments',
  loadComponent: () =>
    import('./my-appointments/my-appointments')
      .then(m => m.MyAppointments)
},
{
  path: 'profile',
  loadComponent: () =>
    import('./profile/profile').then(m => m.Profile)
},
  { path: 'admin-dashboard', 
    loadComponent: () => 
      import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) 
  },

  { path: 'admin-doctors', 
    loadComponent: () => 
      import('./admin-doctors/admin-doctors').then(m => m.AdminDoctors) 
  },

  { path: 'admin-patients', 
    loadComponent: () => 
      import('./admin-patients/admin-patients').then(m => m.AdminPatients) 
  },

  { path: 'admin-appointments', 
    loadComponent: () => 
      import('./admin-appointments/admin-appointments').then(m => m.AdminAppointments) 
  },
   { path: 'doctor-dashboard', 
    loadComponent: () => 
      import('./doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard) 
  },
  { path: 'doctor-appointments', 
    loadComponent: () => 
      import('./doctor-appointments/doctor-appointments').then(m => m.DoctorAppointments) 
  },
  {
  path: 'doctor-profile',
  loadComponent: () =>
    import('./doctor-profile/doctor-profile').then(m => m.DoctorProfileComponent)
}


];
