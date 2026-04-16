import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.css']
})
export class AdminAppointments implements OnInit {

  appointments: any[] = [];
  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token || this.role !== "ADMIN") {
      alert("Unauthorized access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadPendingAppointments();
  }

  loadPendingAppointments() {
    this.http.get<any[]>(
      "https://localhost:7256/api/v1.0/admin/appointments/pending",
      {
        headers: {
          Authorization: "Bearer " + this.token
        }
      }
    ).subscribe({
      next: (res) => {
        console.log("Pending Appointments:", res);
        this.appointments = res;
      },
      error: (err) => {
        console.error(err);
        alert("Unable to load appointments");
      }
    });
  }

  approveAppointment(id: number) {
    this.http.put(
      `https://localhost:7256/api/v1.0/admin/appointments/${id}/approve`,
      {},
      {
        headers: {
          Authorization: "Bearer " + this.token
        }
      }
    ).subscribe({
      next: () => {
        alert("Appointment approved");
        this.loadPendingAppointments();
      },
    });
  }

  rejectAppointment(id: number) {
    if (!confirm("Reject this appointment?")) return;

    this.http.put(
      `https://localhost:7256/api/v1.0/admin/appointments/${id}/reject`,
      {},
      {
        headers: {
          Authorization: "Bearer " + this.token
        }
      }
    ).subscribe({
      next: () => {
        alert("Appointment rejected");
        this.loadPendingAppointments();
      },
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
