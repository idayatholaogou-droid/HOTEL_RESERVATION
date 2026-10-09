var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { LessThan, MoreThan, Not } from 'typeorm';
let ReservationService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReservationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReservationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        reservationRepository;
        constructor(reservationRepository) {
            this.reservationRepository = reservationRepository;
        }
        verifierDates(arrivee, depart) {
            if (!(arrivee < depart)) {
                throw new BadRequestException("La date d'arrivée doit être avant la date de départ");
            }
        }
        async verifierDisponibilite(id_chambre, arrivee, depart, exclureId) {
            const conflit = await this.reservationRepository.findOne({
                where: {
                    chambre: { id_chambre },
                    statut: Not('annulee'),
                    date_arrivee: LessThan(depart),
                    date_depart: MoreThan(arrivee),
                    ...(exclureId !== undefined && { id_reservation: Not(exclureId) }),
                },
            });
            if (conflit) {
                throw new ConflictException('Cette chambre est déjà réservée sur cette période');
            }
        }
        async create(dto) {
            this.verifierDates(dto.date_arrivee, dto.date_depart);
            await this.verifierDisponibilite(dto.id_chambre, dto.date_arrivee, dto.date_depart);
            const reservation = this.reservationRepository.create({
                date_arrivee: dto.date_arrivee,
                date_depart: dto.date_depart,
                client: { id_client: dto.id_client },
                chambre: { id_chambre: dto.id_chambre },
            });
            const enregistree = await this.reservationRepository.save(reservation);
            return this.findOne(enregistree.id_reservation);
        }
        findAll() {
            return this.reservationRepository.find();
        }
        findOne(id) {
            return this.reservationRepository.findOneBy({ id_reservation: id });
        }
        async update(id, dto) {
            const reservation = await this.findOne(id);
            if (!reservation) {
                throw new NotFoundException('Réservation introuvable');
            }
            const { id_client, id_chambre, ...data } = dto;
            Object.assign(reservation, data);
            if (id_client !== undefined) {
                reservation.client = { id_client };
            }
            if (id_chambre !== undefined) {
                reservation.chambre = { id_chambre };
            }
            this.verifierDates(reservation.date_arrivee, reservation.date_depart);
            if (reservation.statut !== 'annulee') {
                await this.verifierDisponibilite(reservation.chambre.id_chambre, reservation.date_arrivee, reservation.date_depart, id);
            }
            await this.reservationRepository.save(reservation);
            return this.findOne(id);
        }
        /**
       * Récupère toutes les réservations d'un client
       */
        async findByClient(id_client) {
            return this.reservationRepository.find({
                where: { client: { id_client } },
                order: { date_arrivee: 'DESC' },
            });
        }
        async annuler(id) {
            const reservation = await this.findOne(id);
            if (!reservation) {
                throw new NotFoundException('Réservation introuvable');
            }
            if (reservation.statut === 'annulee') {
                throw new BadRequestException('Cette réservation est déjà annulée');
            }
            reservation.statut = 'annulee';
            await this.reservationRepository.save(reservation);
            return this.findOne(id);
        }
        /**
       * Ajoute un avis (note + commentaire) à une réservation terminée
       */
        async ajouterAvis(id, id_client, note, commentaire) {
            const reservation = await this.findOne(id);
            if (!reservation) {
                throw new NotFoundException('Réservation introuvable');
            }
            // Vérifie que la réservation appartient bien au client
            if (reservation.client?.id_client !== id_client) {
                throw new BadRequestException('Vous ne pouvez pas noter cette réservation');
            }
            // On ne peut noter qu'une réservation terminée
            if (reservation.statut !== 'terminee') {
                throw new BadRequestException('Vous ne pouvez noter qu\'une réservation terminée');
            }
            // Un avis existe-t-il déjà ?
            if (reservation.note !== null && reservation.note !== undefined) {
                throw new BadRequestException('Vous avez déjà laissé un avis');
            }
            // Note entre 1 et 5
            if (note < 1 || note > 5) {
                throw new BadRequestException('La note doit être entre 1 et 5');
            }
            reservation.note = note;
            reservation.commentaire = commentaire;
            await this.reservationRepository.save(reservation);
            return this.findOne(id);
        }
        /**
         * Récupère tous les avis d'une chambre
         */
        async avisParChambre(id_chambre) {
            const tous = await this.reservationRepository.find({
                where: {
                    chambre: { id_chambre },
                },
                relations: { client: true },
                order: { id_reservation: 'DESC' },
            });
            // Filtre ceux qui ont une note
            const avis = tous.filter((r) => r.note !== null && r.note !== undefined);
            const total = avis.length;
            const moyenne = total > 0
                ? avis.reduce((s, r) => s + (r.note ?? 0), 0) / total
                : 0;
            return {
                moyenne: Number(moyenne.toFixed(1)),
                total,
                avis: avis.map((r) => ({
                    id_reservation: r.id_reservation,
                    note: r.note,
                    commentaire: r.commentaire,
                    client: r.client
                        ? { nom: r.client.nom, prenom: r.client.prenom }
                        : null,
                })),
            };
        }
        /**
       * Check-in : la réservation passe de "confirmee" à "en_cours"
       */
        async checkIn(id) {
            const reservation = await this.findOne(id);
            if (!reservation) {
                throw new NotFoundException('Réservation introuvable');
            }
            if (reservation.statut !== 'confirmee') {
                throw new BadRequestException('Seule une réservation confirmée peut être check-in');
            }
            reservation.statut = 'en_cours';
            await this.reservationRepository.save(reservation);
            return this.findOne(id);
        }
        /**
         * Check-out : la réservation passe de "en_cours" à "terminee"
         */
        async checkOut(id) {
            const reservation = await this.findOne(id);
            if (!reservation) {
                throw new NotFoundException('Réservation introuvable');
            }
            if (reservation.statut !== 'en_cours') {
                throw new BadRequestException('Seule une réservation en cours peut être check-out');
            }
            reservation.statut = 'terminee';
            await this.reservationRepository.save(reservation);
            return this.findOne(id);
        }
        async remove(id) {
            await this.reservationRepository.delete(id);
            return { deleted: true };
        }
    };
    return ReservationService = _classThis;
})();
export { ReservationService };
