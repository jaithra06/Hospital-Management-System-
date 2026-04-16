import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-doctors.html',
  styleUrls: ['./admin-doctors.css']
})
export class AdminDoctors implements OnInit {

  doctors: any[] = [];
  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token || this.role !== "ADMIN") {
      alert("Unauthorized access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadDoctors();
  }

  loadDoctors() {
    this.http.get<any[]>("https://localhost:7256/api/v1.0/admin/doctors", {
      headers: {
        Authorization: "Bearer " + this.token
      }
    }).subscribe({
      next: (res) => {
        console.log("Doctors Loaded:", res);
        this.doctors = res;
      },
      error: (err) => {
        console.error(err);
        alert("Failed to load doctors");
      }
    });
  }

  deleteDoctor(id: number) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    this.http.delete(`https://localhost:7256/api/v1.0/admin/doctor/${id}`, {
      headers: {
        Authorization: "Bearer " + this.token
      }
    }).subscribe({
      next: () => {
        alert("Doctor deleted successfully");
        this.loadDoctors();
      },
      error: (err) => {
        console.error(err);
        alert("Unable to delete doctor");
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
