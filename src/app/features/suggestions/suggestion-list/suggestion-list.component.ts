import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrl: './suggestion-list.component.css'
})
export class SuggestionListComponent implements OnInit {
  suggestions: Suggestion[] = [];

  constructor(private router: Router, private suggestionService: SuggestionService) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des suggestions:', err);
      }
    });
  }

  likeSuggestion(suggestion: Suggestion): void {
    console.log('Like clicked for suggestion:', suggestion.id, 'Current likes:', suggestion.nbLikes);
    
    // Créer un objet complet avec nbLikes incrémenté
    const updatedSuggestion: any = {
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      status: suggestion.status,
      nbLikes: (suggestion.nbLikes || 0) + 1,
      date: suggestion.date
    };
    
    console.log('Sending updated suggestion:', updatedSuggestion);
    
    // Mettre à jour avec PUT complet
    this.suggestionService.updateSuggestion(suggestion.id, updatedSuggestion).subscribe({
      next: (result) => {
        console.log('Update successful:', result);
        // Rafraîchir la liste pour être sûr
        this.loadSuggestions();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des likes:', err);
        alert('Erreur: Cette suggestion n\'existe pas dans la base de données.');
      }
    });
  }

  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          this.loadSuggestions();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }

  goToAddForm(): void {
    this.router.navigate(['/suggestions/add']);
  }
}
