import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  dashboardData: any = {
    doctors: 0,
    patients: 0,
    appointments: 0,
    pendingAppointments: 0
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token || this.role !== "ADMIN") {
      alert("Unauthorized access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboard();
  }

  loadDashboard() {
    this.http.get<any>("https://localhost:7256/api/v1.0/admin/dashboard", {
      headers: {
        Authorization: "Bearer " + this.token
      }
    }).subscribe({
      next: (res) => {
        console.log("Dashboard Loaded:", res);
        this.dashboardData = res;
      },
      error: (err) => {
        console.error(err);
        alert("Failed to load dashboard");
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
