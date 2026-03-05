import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrl: './suggestion-details.component.css'
})
export class SuggestionDetailsComponent implements OnInit {
  suggestionId: number | null = null;
  suggestion: Suggestion | undefined;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    // Récupérer l'id depuis les paramètres de la route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID from route:', id);
      if (id) {
        this.suggestionId = +id; // Convertir en nombre
        console.log('Fetching suggestion with ID:', this.suggestionId);
        // Récupérer la suggestion depuis le service
        this.suggestionService.getSuggestionById(this.suggestionId).subscribe({
          next: (data: any) => {
            console.log('Suggestion received:', data);
            // Le backend renvoie { success: true, suggestion: {...} }
            this.suggestion = data.suggestion || data;
            this.loading = false;
            console.log('Suggestion assigned:', this.suggestion);
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la suggestion:', err);
            this.loading = false;
            alert('Erreur: Impossible de charger la suggestion. Vérifiez que l\'ID existe dans la base de données.');
          }
        });
      }
    });
  }

  goToUpdate(): void {
    if (this.suggestionId) {
      this.router.navigate(['/suggestions/edit', this.suggestionId]);
    }
  }
}
