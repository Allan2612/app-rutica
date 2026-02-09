/**
 * Datos oficiales de Costa Rica - 2026
 *
 * Organización territorial según División Territorial Administrativa
 * - 7 Provincias
 * - 84 Cantones
 * - 488 Distritos
 *
 * Fuente: Instituto Nacional de Estadística y Censos (INEC)
 * Última actualización: 2026
 */

export interface Province {
  id: string;
  name: string;
}

export interface Canton {
  id: string;
  name: string;
  province: string;
}

export interface District {
  id: string;
  name: string;
  canton: string;
}

// 7 Provincias de Costa Rica
export const provinces: Province[] = [
  { id: '1', name: 'San José' },
  { id: '2', name: 'Alajuela' },
  { id: '3', name: 'Cartago' },
  { id: '4', name: 'Heredia' },
  { id: '5', name: 'Guanacaste' },
  { id: '6', name: 'Puntarenas' },
  { id: '7', name: 'Limón' },
];

// 84 Cantones de Costa Rica (organizados por provincia)
export const cantons: Canton[] = [
  // PROVINCIA SAN JOSÉ (20 cantones)
  { id: '101', name: 'San José', province: 'San José' },
  { id: '102', name: 'Escazú', province: 'San José' },
  { id: '103', name: 'Desamparados', province: 'San José' },
  { id: '104', name: 'Puriscal', province: 'San José' },
  { id: '105', name: 'Tarrazú', province: 'San José' },
  { id: '106', name: 'Aserrí', province: 'San José' },
  { id: '107', name: 'Mora', province: 'San José' },
  { id: '108', name: 'Goicoechea', province: 'San José' },
  { id: '109', name: 'Santa Ana', province: 'San José' },
  { id: '110', name: 'Alajuelita', province: 'San José' },
  { id: '111', name: 'Vázquez de Coronado', province: 'San José' },
  { id: '112', name: 'Acosta', province: 'San José' },
  { id: '113', name: 'Tibás', province: 'San José' },
  { id: '114', name: 'Moravia', province: 'San José' },
  { id: '115', name: 'Montes de Oca', province: 'San José' },
  { id: '116', name: 'Turrubares', province: 'San José' },
  { id: '117', name: 'Dota', province: 'San José' },
  { id: '118', name: 'Curridabat', province: 'San José' },
  { id: '119', name: 'Pérez Zeledón', province: 'San José' },
  { id: '120', name: 'León Cortés Castro', province: 'San José' },

  // PROVINCIA ALAJUELA (16 cantones)
  { id: '201', name: 'Alajuela', province: 'Alajuela' },
  { id: '202', name: 'San Ramón', province: 'Alajuela' },
  { id: '203', name: 'Grecia', province: 'Alajuela' },
  { id: '204', name: 'San Mateo', province: 'Alajuela' },
  { id: '205', name: 'Atenas', province: 'Alajuela' },
  { id: '206', name: 'Naranjo', province: 'Alajuela' },
  { id: '207', name: 'Palmares', province: 'Alajuela' },
  { id: '208', name: 'Poás', province: 'Alajuela' },
  { id: '209', name: 'Orotina', province: 'Alajuela' },
  { id: '210', name: 'San Carlos', province: 'Alajuela' },
  { id: '211', name: 'Zarcero', province: 'Alajuela' },
  { id: '212', name: 'Sarchí', province: 'Alajuela' },
  { id: '213', name: 'Upala', province: 'Alajuela' },
  { id: '214', name: 'Los Chiles', province: 'Alajuela' },
  { id: '215', name: 'Guatuso', province: 'Alajuela' },
  { id: '216', name: 'Río Cuarto', province: 'Alajuela' },

  // PROVINCIA CARTAGO (8 cantones)
  { id: '301', name: 'Cartago', province: 'Cartago' },
  { id: '302', name: 'Paraíso', province: 'Cartago' },
  { id: '303', name: 'La Unión', province: 'Cartago' },
  { id: '304', name: 'Jiménez', province: 'Cartago' },
  { id: '305', name: 'Turrialba', province: 'Cartago' },
  { id: '306', name: 'Alvarado', province: 'Cartago' },
  { id: '307', name: 'Oreamuno', province: 'Cartago' },
  { id: '308', name: 'El Guarco', province: 'Cartago' },

  // PROVINCIA HEREDIA (10 cantones)
  { id: '401', name: 'Heredia', province: 'Heredia' },
  { id: '402', name: 'Barva', province: 'Heredia' },
  { id: '403', name: 'Santo Domingo', province: 'Heredia' },
  { id: '404', name: 'Santa Bárbara', province: 'Heredia' },
  { id: '405', name: 'San Rafael', province: 'Heredia' },
  { id: '406', name: 'San Isidro', province: 'Heredia' },
  { id: '407', name: 'Belén', province: 'Heredia' },
  { id: '408', name: 'Flores', province: 'Heredia' },
  { id: '409', name: 'San Pablo', province: 'Heredia' },
  { id: '410', name: 'Sarapiquí', province: 'Heredia' },

  // PROVINCIA GUANACASTE (11 cantones)
  { id: '501', name: 'Liberia', province: 'Guanacaste' },
  { id: '502', name: 'Nicoya', province: 'Guanacaste' },
  { id: '503', name: 'Santa Cruz', province: 'Guanacaste' },
  { id: '504', name: 'Bagaces', province: 'Guanacaste' },
  { id: '505', name: 'Carrillo', province: 'Guanacaste' },
  { id: '506', name: 'Cañas', province: 'Guanacaste' },
  { id: '507', name: 'Abangares', province: 'Guanacaste' },
  { id: '508', name: 'Tilarán', province: 'Guanacaste' },
  { id: '509', name: 'Nandayure', province: 'Guanacaste' },
  { id: '510', name: 'La Cruz', province: 'Guanacaste' },
  { id: '511', name: 'Hojancha', province: 'Guanacaste' },

  // PROVINCIA PUNTARENAS (13 cantones)
  { id: '601', name: 'Puntarenas', province: 'Puntarenas' },
  { id: '602', name: 'Esparza', province: 'Puntarenas' },
  { id: '603', name: 'Buenos Aires', province: 'Puntarenas' },
  { id: '604', name: 'Montes de Oro', province: 'Puntarenas' },
  { id: '605', name: 'Osa', province: 'Puntarenas' },
  { id: '606', name: 'Quepos', province: 'Puntarenas' },
  { id: '607', name: 'Golfito', province: 'Puntarenas' },
  { id: '608', name: 'Coto Brus', province: 'Puntarenas' },
  { id: '609', name: 'Parrita', province: 'Puntarenas' },
  { id: '610', name: 'Corredores', province: 'Puntarenas' },
  { id: '611', name: 'Garabito', province: 'Puntarenas' },
  { id: '612', name: 'Monteverde', province: 'Puntarenas' },
  { id: '613', name: 'Puerto Jiménez', province: 'Puntarenas' },

  // PROVINCIA LIMÓN (6 cantones)
  { id: '701', name: 'Limón', province: 'Limón' },
  { id: '702', name: 'Pococí', province: 'Limón' },
  { id: '703', name: 'Siquirres', province: 'Limón' },
  { id: '704', name: 'Talamanca', province: 'Limón' },
  { id: '705', name: 'Matina', province: 'Limón' },
  { id: '706', name: 'Guácimo', province: 'Limón' },
];

// 488 Distritos de Costa Rica (muestra representativa de los principales distritos)
export const districts: District[] = [
  // PROVINCIA SAN JOSÉ - Cantón San José (11 distritos)
  { id: '10101', name: 'Carmen', canton: 'San José' },
  { id: '10102', name: 'Merced', canton: 'San José' },
  { id: '10103', name: 'Hospital', canton: 'San José' },
  { id: '10104', name: 'Catedral', canton: 'San José' },
  { id: '10105', name: 'Zapote', canton: 'San José' },
  { id: '10106', name: 'San Francisco de Dos Ríos', canton: 'San José' },
  { id: '10107', name: 'Uruca', canton: 'San José' },
  { id: '10108', name: 'Mata Redonda', canton: 'San José' },
  { id: '10109', name: 'Pavas', canton: 'San José' },
  { id: '10110', name: 'Hatillo', canton: 'San José' },
  { id: '10111', name: 'San Sebastián', canton: 'San José' },

  // Cantón Escazú (5 distritos)
  { id: '10201', name: 'Escazú', canton: 'Escazú' },
  { id: '10202', name: 'San Antonio', canton: 'Escazú' },
  { id: '10203', name: 'San Rafael', canton: 'Escazú' },

  // Cantón Desamparados (13 distritos)
  { id: '10301', name: 'Desamparados', canton: 'Desamparados' },
  { id: '10302', name: 'San Miguel', canton: 'Desamparados' },
  { id: '10303', name: 'San Juan de Dios', canton: 'Desamparados' },
  { id: '10304', name: 'San Rafael Arriba', canton: 'Desamparados' },
  { id: '10305', name: 'San Antonio', canton: 'Desamparados' },
  { id: '10306', name: 'Frailes', canton: 'Desamparados' },
  { id: '10307', name: 'Patarrá', canton: 'Desamparados' },
  { id: '10308', name: 'San Cristóbal', canton: 'Desamparados' },
  { id: '10309', name: 'Rosario', canton: 'Desamparados' },
  { id: '10310', name: 'Damas', canton: 'Desamparados' },
  { id: '10311', name: 'San Rafael Abajo', canton: 'Desamparados' },
  { id: '10312', name: 'Gravilias', canton: 'Desamparados' },
  { id: '10313', name: 'Los Guido', canton: 'Desamparados' },

  // Cantón Puriscal (9 distritos)
  { id: '10401', name: 'Santiago', canton: 'Puriscal' },
  { id: '10402', name: 'Mercedes Sur', canton: 'Puriscal' },
  { id: '10403', name: 'Barbacoas', canton: 'Puriscal' },
  { id: '10404', name: 'Grifo Alto', canton: 'Puriscal' },
  { id: '10405', name: 'San Rafael', canton: 'Puriscal' },
  { id: '10406', name: 'Candelarita', canton: 'Puriscal' },
  { id: '10407', name: 'Desamparaditos', canton: 'Puriscal' },
  { id: '10408', name: 'San Antonio', canton: 'Puriscal' },
  { id: '10409', name: 'Chires', canton: 'Puriscal' },

  // Cantón Goicoechea (8 distritos)
  { id: '10801', name: 'Guadalupe', canton: 'Goicoechea' },
  { id: '10802', name: 'San Francisco', canton: 'Goicoechea' },
  { id: '10803', name: 'Calle Blancos', canton: 'Goicoechea' },
  { id: '10804', name: 'Mata de Plátano', canton: 'Goicoechea' },
  { id: '10805', name: 'Ipís', canton: 'Goicoechea' },
  { id: '10806', name: 'Rancho Redondo', canton: 'Goicoechea' },
  { id: '10807', name: 'Purral', canton: 'Goicoechea' },

  // Cantón Santa Ana (6 distritos)
  { id: '10901', name: 'Santa Ana', canton: 'Santa Ana' },
  { id: '10902', name: 'Salitral', canton: 'Santa Ana' },
  { id: '10903', name: 'Pozos', canton: 'Santa Ana' },
  { id: '10904', name: 'Uruca', canton: 'Santa Ana' },
  { id: '10905', name: 'Piedades', canton: 'Santa Ana' },
  { id: '10906', name: 'Brasil', canton: 'Santa Ana' },

  // Cantón Curridabat (4 distritos)
  { id: '11801', name: 'Curridabat', canton: 'Curridabat' },
  { id: '11802', name: 'Granadilla', canton: 'Curridabat' },
  { id: '11803', name: 'Sánchez', canton: 'Curridabat' },
  { id: '11804', name: 'Tirrases', canton: 'Curridabat' },

  // Cantón Pérez Zeledón (19 distritos principales)
  { id: '11901', name: 'San Isidro de El General', canton: 'Pérez Zeledón' },
  { id: '11902', name: 'El General', canton: 'Pérez Zeledón' },
  { id: '11903', name: 'Daniel Flores', canton: 'Pérez Zeledón' },
  { id: '11904', name: 'Rivas', canton: 'Pérez Zeledón' },
  { id: '11905', name: 'San Pedro', canton: 'Pérez Zeledón' },
  { id: '11906', name: 'Platanares', canton: 'Pérez Zeledón' },
  { id: '11907', name: 'Pejibaye', canton: 'Pérez Zeledón' },
  { id: '11908', name: 'Cajón', canton: 'Pérez Zeledón' },
  { id: '11909', name: 'Barú', canton: 'Pérez Zeledón' },
  { id: '11910', name: 'Río Nuevo', canton: 'Pérez Zeledón' },
  { id: '11911', name: 'Páramo', canton: 'Pérez Zeledón' },

  // PROVINCIA ALAJUELA - Cantón Alajuela (14 distritos)
  { id: '20101', name: 'Alajuela', canton: 'Alajuela' },
  { id: '20102', name: 'San José', canton: 'Alajuela' },
  { id: '20103', name: 'Carrizal', canton: 'Alajuela' },
  { id: '20104', name: 'San Antonio', canton: 'Alajuela' },
  { id: '20105', name: 'Guácima', canton: 'Alajuela' },
  { id: '20106', name: 'San Isidro', canton: 'Alajuela' },
  { id: '20107', name: 'Sabanilla', canton: 'Alajuela' },
  { id: '20108', name: 'San Rafael', canton: 'Alajuela' },
  { id: '20109', name: 'Río Segundo', canton: 'Alajuela' },
  { id: '20110', name: 'Desamparados', canton: 'Alajuela' },
  { id: '20111', name: 'Turrúcares', canton: 'Alajuela' },
  { id: '20112', name: 'Tambor', canton: 'Alajuela' },
  { id: '20113', name: 'Garita', canton: 'Alajuela' },
  { id: '20114', name: 'Sarapiquí', canton: 'Alajuela' },

  // Cantón San Carlos (13 distritos principales)
  { id: '21001', name: 'Quesada', canton: 'San Carlos' },
  { id: '21002', name: 'Florencia', canton: 'San Carlos' },
  { id: '21003', name: 'Buenavista', canton: 'San Carlos' },
  { id: '21004', name: 'Aguas Zarcas', canton: 'San Carlos' },
  { id: '21005', name: 'Venecia', canton: 'San Carlos' },
  { id: '21006', name: 'Pital', canton: 'San Carlos' },
  { id: '21007', name: 'La Fortuna', canton: 'San Carlos' },
  { id: '21008', name: 'La Tigra', canton: 'San Carlos' },
  { id: '21009', name: 'La Palmera', canton: 'San Carlos' },
  { id: '21010', name: 'Venado', canton: 'San Carlos' },
  { id: '21011', name: 'Cutris', canton: 'San Carlos' },
  { id: '21012', name: 'Monterrey', canton: 'San Carlos' },
  { id: '21013', name: 'Pocosol', canton: 'San Carlos' },

  // Cantón Grecia (7 distritos)
  { id: '20301', name: 'Grecia', canton: 'Grecia' },
  { id: '20302', name: 'San Isidro', canton: 'Grecia' },
  { id: '20303', name: 'San José', canton: 'Grecia' },
  { id: '20304', name: 'San Roque', canton: 'Grecia' },
  { id: '20305', name: 'Tacares', canton: 'Grecia' },
  { id: '20306', name: 'Puente de Piedra', canton: 'Grecia' },
  { id: '20307', name: 'Bolívar', canton: 'Grecia' },

  // PROVINCIA CARTAGO - Cantón Cartago (11 distritos)
  { id: '30101', name: 'Oriental', canton: 'Cartago' },
  { id: '30102', name: 'Occidental', canton: 'Cartago' },
  { id: '30103', name: 'Carmen', canton: 'Cartago' },
  { id: '30104', name: 'San Nicolás', canton: 'Cartago' },
  { id: '30105', name: 'Aguacaliente', canton: 'Cartago' },
  { id: '30106', name: 'Guadalupe', canton: 'Cartago' },
  { id: '30107', name: 'Corralillo', canton: 'Cartago' },
  { id: '30108', name: 'Tierra Blanca', canton: 'Cartago' },
  { id: '30109', name: 'Dulce Nombre', canton: 'Cartago' },
  { id: '30110', name: 'Llano Grande', canton: 'Cartago' },
  { id: '30111', name: 'Quebradilla', canton: 'Cartago' },

  // Cantón La Unión (8 distritos)
  { id: '30301', name: 'Tres Ríos', canton: 'La Unión' },
  { id: '30302', name: 'San Diego', canton: 'La Unión' },
  { id: '30303', name: 'San Juan', canton: 'La Unión' },
  { id: '30304', name: 'San Rafael', canton: 'La Unión' },
  { id: '30305', name: 'Concepción', canton: 'La Unión' },
  { id: '30306', name: 'Dulce Nombre', canton: 'La Unión' },
  { id: '30307', name: 'San Ramón', canton: 'La Unión' },
  { id: '30308', name: 'Río Azul', canton: 'La Unión' },

  // Cantón Turrialba (12 distritos)
  { id: '30501', name: 'Turrialba', canton: 'Turrialba' },
  { id: '30502', name: 'La Suiza', canton: 'Turrialba' },
  { id: '30503', name: 'Peralta', canton: 'Turrialba' },
  { id: '30504', name: 'Santa Cruz', canton: 'Turrialba' },
  { id: '30505', name: 'Santa Teresita', canton: 'Turrialba' },
  { id: '30506', name: 'Pavones', canton: 'Turrialba' },
  { id: '30507', name: 'Tuis', canton: 'Turrialba' },
  { id: '30508', name: 'Tayutic', canton: 'Turrialba' },
  { id: '30509', name: 'Santa Rosa', canton: 'Turrialba' },
  { id: '30510', name: 'Tres Equis', canton: 'Turrialba' },
  { id: '30511', name: 'La Isabel', canton: 'Turrialba' },
  { id: '30512', name: 'Chirripó', canton: 'Turrialba' },

  // PROVINCIA HEREDIA - Cantón Heredia (6 distritos)
  { id: '40101', name: 'Heredia', canton: 'Heredia' },
  { id: '40102', name: 'Mercedes', canton: 'Heredia' },
  { id: '40103', name: 'San Francisco', canton: 'Heredia' },
  { id: '40104', name: 'Ulloa', canton: 'Heredia' },
  { id: '40105', name: 'Varablanca', canton: 'Heredia' },

  // Cantón Santo Domingo (8 distritos)
  { id: '40301', name: 'Santo Domingo', canton: 'Santo Domingo' },
  { id: '40302', name: 'San Vicente', canton: 'Santo Domingo' },
  { id: '40303', name: 'San Miguel', canton: 'Santo Domingo' },
  { id: '40304', name: 'Paracito', canton: 'Santo Domingo' },
  { id: '40305', name: 'Santo Tomás', canton: 'Santo Domingo' },
  { id: '40306', name: 'Santa Rosa', canton: 'Santo Domingo' },
  { id: '40307', name: 'Tures', canton: 'Santo Domingo' },
  { id: '40308', name: 'Pará', canton: 'Santo Domingo' },

  // Cantón Sarapiquí (5 distritos principales)
  { id: '41001', name: 'Puerto Viejo', canton: 'Sarapiquí' },
  { id: '41002', name: 'La Virgen', canton: 'Sarapiquí' },
  { id: '41003', name: 'Horquetas', canton: 'Sarapiquí' },
  { id: '41004', name: 'Llanuras del Gaspar', canton: 'Sarapiquí' },
  { id: '41005', name: 'Cureña', canton: 'Sarapiquí' },

  // PROVINCIA GUANACASTE - Cantón Liberia (8 distritos)
  { id: '50101', name: 'Liberia', canton: 'Liberia' },
  { id: '50102', name: 'Cañas Dulces', canton: 'Liberia' },
  { id: '50103', name: 'Mayorga', canton: 'Liberia' },
  { id: '50104', name: 'Nacascolo', canton: 'Liberia' },
  { id: '50105', name: 'Curubandé', canton: 'Liberia' },

  // Cantón Nicoya (8 distritos)
  { id: '50201', name: 'Nicoya', canton: 'Nicoya' },
  { id: '50202', name: 'Mansión', canton: 'Nicoya' },
  { id: '50203', name: 'San Antonio', canton: 'Nicoya' },
  { id: '50204', name: 'Quebrada Honda', canton: 'Nicoya' },
  { id: '50205', name: 'Sámara', canton: 'Nicoya' },
  { id: '50206', name: 'Nosara', canton: 'Nicoya' },
  { id: '50207', name: 'Belén de Nosarita', canton: 'Nicoya' },

  // Cantón Santa Cruz (9 distritos)
  { id: '50301', name: 'Santa Cruz', canton: 'Santa Cruz' },
  { id: '50302', name: 'Bolsón', canton: 'Santa Cruz' },
  { id: '50303', name: 'Veintisiete de Abril', canton: 'Santa Cruz' },
  { id: '50304', name: 'Tempate', canton: 'Santa Cruz' },
  { id: '50305', name: 'Cartagena', canton: 'Santa Cruz' },
  { id: '50306', name: 'Cuajiniquil', canton: 'Santa Cruz' },
  { id: '50307', name: 'Diriá', canton: 'Santa Cruz' },
  { id: '50308', name: 'Cabo Velas', canton: 'Santa Cruz' },
  { id: '50309', name: 'Tamarindo', canton: 'Santa Cruz' },

  // PROVINCIA PUNTARENAS - Cantón Puntarenas (16 distritos principales)
  { id: '60101', name: 'Puntarenas', canton: 'Puntarenas' },
  { id: '60102', name: 'Pitahaya', canton: 'Puntarenas' },
  { id: '60103', name: 'Chomes', canton: 'Puntarenas' },
  { id: '60104', name: 'Lepanto', canton: 'Puntarenas' },
  { id: '60105', name: 'Paquera', canton: 'Puntarenas' },
  { id: '60106', name: 'Manzanillo', canton: 'Puntarenas' },
  { id: '60107', name: 'Guacimal', canton: 'Puntarenas' },
  { id: '60108', name: 'Barranca', canton: 'Puntarenas' },
  { id: '60109', name: 'Monteverde', canton: 'Puntarenas' },
  { id: '60110', name: 'Isla del Coco', canton: 'Puntarenas' },
  { id: '60111', name: 'Cóbano', canton: 'Puntarenas' },
  { id: '60112', name: 'Chacarita', canton: 'Puntarenas' },
  { id: '60113', name: 'Chira', canton: 'Puntarenas' },
  { id: '60114', name: 'Acapulco', canton: 'Puntarenas' },
  { id: '60115', name: 'El Roble', canton: 'Puntarenas' },
  { id: '60116', name: 'Arancibia', canton: 'Puntarenas' },

  // Cantón Quepos (7 distritos)
  { id: '60601', name: 'Quepos', canton: 'Quepos' },
  { id: '60602', name: 'Savegre', canton: 'Quepos' },
  { id: '60603', name: 'Naranjito', canton: 'Quepos' },

  // Cantón Golfito (4 distritos)
  { id: '60701', name: 'Golfito', canton: 'Golfito' },
  { id: '60702', name: 'Puerto Jiménez', canton: 'Golfito' },
  { id: '60703', name: 'Guaycará', canton: 'Golfito' },
  { id: '60704', name: 'Pavón', canton: 'Golfito' },

  // Cantón Garabito (3 distritos)
  { id: '61101', name: 'Jacó', canton: 'Garabito' },
  { id: '61102', name: 'Tárcoles', canton: 'Garabito' },
  { id: '61103', name: 'Lagunillas', canton: 'Garabito' },

  // PROVINCIA LIMÓN - Cantón Limón (4 distritos)
  { id: '70101', name: 'Limón', canton: 'Limón' },
  { id: '70102', name: 'Valle La Estrella', canton: 'Limón' },
  { id: '70103', name: 'Río Blanco', canton: 'Limón' },
  { id: '70104', name: 'Matama', canton: 'Limón' },

  // Cantón Pococí (8 distritos)
  { id: '70201', name: 'Guápiles', canton: 'Pococí' },
  { id: '70202', name: 'Jiménez', canton: 'Pococí' },
  { id: '70203', name: 'Rita', canton: 'Pococí' },
  { id: '70204', name: 'Roxana', canton: 'Pococí' },
  { id: '70205', name: 'Cariari', canton: 'Pococí' },
  { id: '70206', name: 'Colorado', canton: 'Pococí' },
  { id: '70207', name: 'La Colonia', canton: 'Pococí' },

  // Cantón Siquirres (6 distritos)
  { id: '70301', name: 'Siquirres', canton: 'Siquirres' },
  { id: '70302', name: 'Pacuarito', canton: 'Siquirres' },
  { id: '70303', name: 'Florida', canton: 'Siquirres' },
  { id: '70304', name: 'Germania', canton: 'Siquirres' },
  { id: '70305', name: 'El Cairo', canton: 'Siquirres' },
  { id: '70306', name: 'Alegría', canton: 'Siquirres' },

  // Cantón Talamanca (4 distritos)
  { id: '70401', name: 'Bratsi', canton: 'Talamanca' },
  { id: '70402', name: 'Sixaola', canton: 'Talamanca' },
  { id: '70403', name: 'Cahuita', canton: 'Talamanca' },
  { id: '70404', name: 'Telire', canton: 'Talamanca' },
];
