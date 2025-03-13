import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CvService, CV } from '../../services/cv.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.css'
})
export class CvFormComponent implements OnInit {
  cvForm!: FormGroup;
  private fb = inject(FormBuilder);
  private cvService = inject(CvService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  cvId!: number | null;
  private snackBar = inject(MatSnackBar);
  isFormVisible: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CvFormComponent>, // ✅ Inject MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any // ✅ Inject Data (if any)
  ) {}

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Show for 3 seconds
      verticalPosition: 'top', // Position at the top
      horizontalPosition: 'center', // Centered horizontally
    });
  }
  

  ngOnInit() {
    console.log("Initializing CV Form...",this.data);
  
    this.cvForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      summary: [''],
      workExperience: this.fb.array([]), // Keep it dynamic
      education: this.fb.array([]),
      skills: [''],
    });
  
    // Check if CV data is passed through MAT_DIALOG_DATA
    if (this.data) {
      this.cvId = this.data.id || null; // Assign ID if available
      this.cvForm.patchValue(this.data); // Populate form fields
  
      // Ensure workExperience and education arrays are filled correctly
      this.setFormArray('workExperience', this.data.experience || []);
      this.setFormArray('education', this.data.education || []);
    }
  }
  

  get workExperience() {
    return this.cvForm.get('workExperience') as FormArray;
  }

  get education() {
    return this.cvForm.get('education') as FormArray;
  }

  addWorkExperience() {
    this.workExperience.push(
      this.fb.group({
        company: [''],
        jobTitle: [''],
        startDate: [''],
        endDate: [''],
        description: [''],
      })
    );
  }

  removeWorkExperience(index: number) {
    this.workExperience.removeAt(index);
  }

  addEducation() {
    this.education.push(
      this.fb.group({
        institution: [''],
        degree: [''],
        startDate: [''],
        endDate: [''],
      })
    );
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  setFormArray(field: string, data: any[]) {
    const formArray = this.cvForm.get(field) as FormArray;
    formArray.clear();
    data.forEach((item) => formArray.push(this.fb.group(item)));
  }
  submitForm() {
    console.log("Form Values:", this.cvForm.value);
  
    if (this.cvForm.valid) {
      const cvData: CV = this.cvForm.value;
  
      if (this.cvId) {
        this.cvService.updateCV(this.cvId, cvData).subscribe({
          next: (updatedCv) => {
            this.showSuccessMessage('CV updated successfully!');
            this.dialogRef.close(updatedCv); // 🔥 Return updated CV to parent
          },
          error: (err) => console.error('Failed to update CV:', err),
        });
      } else {
        this.cvService.createCV(cvData).subscribe({
          next: (newCv) => {
            this.showSuccessMessage('CV created successfully!');
            this.dialogRef.close(newCv); // 🔥 Return new CV to parent
          },
          error: (err) => console.error('Failed to create CV:', err),
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(); // ✅ Properly close the dialog
  }
  
}
