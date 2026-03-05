import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  id: number | null = null;
  isEditMode: boolean = false;
  suggestion: Suggestion | undefined;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actR: ActivatedRoute,
    private service: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString('fr-FR'), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });

    // Vérifier si on est en mode édition
    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
      this.isEditMode = true;
      this.service.getSuggestionById(this.id).subscribe((data) => {
        this.suggestion = data;
        this.suggestionForm.patchValue({
          title: this.suggestion.title,
          description: this.suggestion.description,
          category: this.suggestion.category,
          date: new Date(this.suggestion.date).toLocaleDateString('fr-FR'),
          status: this.suggestion.status
        });
      });
    }
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const suggestionData: Suggestion = {
      id: this.isEditMode && this.suggestion ? this.suggestion.id : 0,
      title: this.suggestionForm.value.title,
      description: this.suggestionForm.value.description,
      category: this.suggestionForm.value.category,
      date: this.isEditMode && this.suggestion ? this.suggestion.date : new Date(),
      status: this.isEditMode && this.suggestion ? this.suggestion.status : 'en attente',
      nbLikes: this.isEditMode && this.suggestion ? this.suggestion.nbLikes : 0
    };

    if (this.isEditMode && this.id) {
      // Mode modification
      this.service.updateSuggestion(this.id, suggestionData).subscribe({
        next: () => {
          this.router.navigate(['/suggestions']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
        }
      });
    } else {
      // Mode ajout
      this.service.addSuggestion(suggestionData).subscribe({
        next: () => {
          this.router.navigate(['/suggestions']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
        }
      });
    }
  }
}