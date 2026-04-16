import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterLink],   // 👈 REQUIRED
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css']
})
export class PatientDashboard {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/landing']);
  }
}
