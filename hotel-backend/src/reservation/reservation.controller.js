var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { Controller, Get, Post, Patch, Delete, UseGuards, ForbiddenException, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let ReservationController = (() => {
    let _classDecorators = [Controller('reservation'), UseGuards(JwtAuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _mesReservations_decorators;
    let _ajouterAvis_decorators;
    let _annuler_decorators;
    let _avisChambre_decorators;
    let _createComptoir_decorators;
    let _checkIn_decorators;
    let _checkOut_decorators;
    let _findAll_decorators;
    let _update_decorators;
    let _remove_decorators;
    let _findOne_decorators;
    var ReservationController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _create_decorators = [Post()];
            _mesReservations_decorators = [Get('mes-reservations')];
            _ajouterAvis_decorators = [Patch(':id/avis')];
            _annuler_decorators = [Patch(':id/annuler')];
            _avisChambre_decorators = [Get('avis/chambre/:id_chambre')];
            _createComptoir_decorators = [Post('comptoir'), UseGuards(RolesGuard), Roles('receptionniste')];
            _checkIn_decorators = [Patch(':id/check-in'), UseGuards(RolesGuard), Roles('receptionniste')];
            _checkOut_decorators = [Patch(':id/check-out'), UseGuards(RolesGuard), Roles('receptionniste')];
            _findAll_decorators = [Get(), UseGuards(RolesGuard), Roles('receptionniste', 'admin')];
            _update_decorators = [Patch(':id'), UseGuards(RolesGuard), Roles('receptionniste', 'admin')];
            _remove_decorators = [Delete(':id'), UseGuards(RolesGuard), Roles('admin')];
            _findOne_decorators = [Get(':id')];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _mesReservations_decorators, { kind: "method", name: "mesReservations", static: false, private: false, access: { has: obj => "mesReservations" in obj, get: obj => obj.mesReservations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _ajouterAvis_decorators, { kind: "method", name: "ajouterAvis", static: false, private: false, access: { has: obj => "ajouterAvis" in obj, get: obj => obj.ajouterAvis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _annuler_decorators, { kind: "method", name: "annuler", static: false, private: false, access: { has: obj => "annuler" in obj, get: obj => obj.annuler }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _avisChambre_decorators, { kind: "method", name: "avisChambre", static: false, private: false, access: { has: obj => "avisChambre" in obj, get: obj => obj.avisChambre }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createComptoir_decorators, { kind: "method", name: "createComptoir", static: false, private: false, access: { has: obj => "createComptoir" in obj, get: obj => obj.createComptoir }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkIn_decorators, { kind: "method", name: "checkIn", static: false, private: false, access: { has: obj => "checkIn" in obj, get: obj => obj.checkIn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkOut_decorators, { kind: "method", name: "checkOut", static: false, private: false, access: { has: obj => "checkOut" in obj, get: obj => obj.checkOut }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReservationController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        reservationService = __runInitializers(this, _instanceExtraInitializers);
        constructor(reservationService) {
            this.reservationService = reservationService;
        }
        // ==========================================
        // CLIENT connecté
        // ==========================================
        // 🔒 CLIENT : créer SA réservation (id_client du token)
        create(dto, req) {
            const id_client = req.user.id_client;
            if (id_client === null) {
                throw new ForbiddenException('Seul un client peut créer une réservation');
            }
            return this.reservationService.create({ ...dto, id_client });
        }
        // 🔒 CLIENT : voir SES réservations
        mesReservations(req) {
            const id_client = req.user.id_client;
            if (id_client === null) {
                throw new ForbiddenException('Seul un client peut consulter ses réservations');
            }
            return this.reservationService.findByClient(id_client);
        }
        // 🔒 CLIENT : ajouter un avis sur SA réservation
        ajouterAvis(id, body, req) {
            const id_client = req.user.id_client;
            if (id_client === null) {
                throw new ForbiddenException('Seul un client peut laisser un avis');
            }
            return this.reservationService.ajouterAvis(+id, id_client, body.note, body.commentaire);
        }
        // 🔒 CLIENT : annuler SA réservation (ou admin)
        annuler(id) {
            return this.reservationService.annuler(+id);
        }
        // 🔓 PUBLIC : voir les avis d'une chambre
        avisChambre(id_chambre) {
            return this.reservationService.avisParChambre(+id_chambre);
        }
        // ==========================================
        // RÉCEPTIONNISTE
        // ==========================================
        // 🔒 RÉCEPTIONNISTE : créer une réservation AU COMPTOIR
        createComptoir(dto) {
            // dto contient id_client (choisi par le récep)
            return this.reservationService.create(dto);
        }
        // 🔒 RÉCEPTIONNISTE : check-in
        checkIn(id) {
            return this.reservationService.checkIn(+id);
        }
        // 🔒 RÉCEPTIONNISTE : check-out
        checkOut(id) {
            return this.reservationService.checkOut(+id);
        }
        // ==========================================
        // RÉCEP + ADMIN
        // ==========================================
        // 🔒 RÉCEP + ADMIN : voir TOUTES les réservations
        findAll() {
            return this.reservationService.findAll();
        }
        // 🔒 RÉCEP + ADMIN : modifier une réservation
        update(id, updateReservationDto) {
            return this.reservationService.update(+id, updateReservationDto);
        }
        // ==========================================
        // ADMIN uniquement
        // ==========================================
        // 👑 ADMIN : supprimer une réservation
        remove(id) {
            return this.reservationService.remove(+id);
        }
        // ⚠️ Route `:id` EN DERNIER
        findOne(id) {
            return this.reservationService.findOne(+id);
        }
    };
    return ReservationController = _classThis;
})();
export { ReservationController };
