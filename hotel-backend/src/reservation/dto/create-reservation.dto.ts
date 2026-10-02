export class CreateReservationDto {
  date_arrivee: string;
  date_depart: string;
  statut?: string;
  id_client: number;
  id_chambre: number;
  id_utilisateur: number;
}