import { Component, OnInit } from '@angular/core';
import { Player } from './models/player';
import { Sport } from './models/sport';
import { Team } from './models/team';
import { PlayerService } from './services/player.service';
import { SportsService } from './services/sports.service';
import { TeamService } from './services/team.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'innovise-sports';
  sports: Sport[];
  teams: Team[];
  players: Player[];
  innoviseForm: FormGroup;

constructor(private teamService: TeamService,
  private sportsService: SportsService,
  private playerService: PlayerService,
  private fb: FormBuilder) {
}


  ngOnInit(): void {
    
    this.innoviseForm = this.fb.group({
      sports: [1, Validators.required],
      teams: [1, Validators.required]
    }); 

    this.sportsService.sports$.subscribe(sports => {
      this.sports = sports;
    });

    this.sportsService.GetAllSports().subscribe(result => {
      if (result) {
        this.changeSport(this.sports[0].Id);

        // Set the first team
        this.changeTeam();
      }
    });

    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });

    this.playerService.players$.subscribe(players => {
      this.players = players;
    });

    this.innoviseForm.get('sports').valueChanges
    .subscribe(sportId => {
      this.changeSport(sportId);
    })

    this.innoviseForm.get('teams').valueChanges
    .subscribe(teamId => {
      this.changeTeam(teamId);
    })
  }

  changeSport(sportId): void {
    var sport = this.sports.filter(sp => sp.Id == sportId)[0];
    this.sportsService.SelectSport(sport)

    this.teamService.GetTeamsForSport()
    .subscribe(result=>{
      this.players = [];
    });
  }
  
  changeTeam(teamId: number = 1): void {
    this.playerService.GetPlayersForTeam(teamId).subscribe(result => {
    });
  }


}
