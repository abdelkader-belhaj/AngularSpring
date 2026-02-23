import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  suggestions: Suggestion[] = [];

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

  constructor(private fb: FormBuilder, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.suggestions = nav.extras.state['suggestions'];
    }
  }

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
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const newId = this.suggestions.length > 0
      ? Math.max(...this.suggestions.map(s => s.id)) + 1
      : 1;

    const newSuggestion: Suggestion = {
      id: newId,
      title: this.suggestionForm.value.title,
      description: this.suggestionForm.value.description,
      category: this.suggestionForm.value.category,
      date: new Date(),
      status: 'en attente',
      nbLikes: 0
    };

    this.suggestions.push(newSuggestion);

    this.router.navigate(['/suggestions'], {
      state: { suggestions: this.suggestions }
    });
  }
}