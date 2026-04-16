import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-patients',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-patients.html',
  styleUrls: ['./admin-patients.css']
})
export class AdminPatients implements OnInit {

  patients: any[] = [];
  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  private apiUrl = "https://localhost:7256/api/v1.0/admin/patients";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token || this.role !== "ADMIN") {
      alert("Unauthorized access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadPatients();
  }

  loadPatients() {
    this.http.get<any[]>(this.apiUrl, {
      headers: {
        Authorization: "Bearer " + this.token
      }
    }).subscribe({
      next: (res) => {
        console.log("Patients Loaded:", res);
        this.patients = res;
      },
      error: (err) => {
        console.error("Error loading patients:", err);
        alert("Failed to load patients");
      }
    });
  }

  deletePatient(id: number) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    this.http.delete(
      `https://localhost:7256/api/v1.0/admin/patient/${id}`,
      {
        headers: {
          Authorization: "Bearer " + this.token
        }
      }
    ).subscribe({
      next: () => {
        alert("Patient deleted successfully");
        this.loadPatients();
      },
      error: (err) => {
        console.error("Delete failed:", err);
        alert("Unable to delete patient");
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
