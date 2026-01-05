// Datos mock de ubicaciones de Costa Rica
// TODO: Reemplazar con datos reales desde API/base de datos

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

// Provincias de Costa Rica
export const mockProvinces: Province[] = [
  { id: '1', name: 'San José' },
  { id: '2', name: 'Alajuela' },
  { id: '3', name: 'Cartago' },
  { id: '4', name: 'Heredia' },
  { id: '5', name: 'Guanacaste' },
  { id: '6', name: 'Puntarenas' },
  { id: '7', name: 'Limón' },
];

// Cantones (algunos ejemplos por provincia)
export const mockCantons: Canton[] = [
  // San José
  { id: 'c1', name: 'San José', province: 'San José' },
  { id: 'c2', name: 'Escazú', province: 'San José' },
  { id: 'c3', name: 'Desamparados', province: 'San José' },
  { id: 'c4', name: 'Puriscal', province: 'San José' },
  { id: 'c5', name: 'Tarrazú', province: 'San José' },
  { id: 'c6', name: 'Aserrí', province: 'San José' },
  { id: 'c7', name: 'Mora', province: 'San José' },
  { id: 'c8', name: 'Goicoechea', province: 'San José' },
  { id: 'c9', name: 'Santa Ana', province: 'San José' },
  { id: 'c10', name: 'Alajuelita', province: 'San José' },
  
  // Alajuela
  { id: 'c11', name: 'Alajuela', province: 'Alajuela' },
  { id: 'c12', name: 'San Ramón', province: 'Alajuela' },
  { id: 'c13', name: 'Grecia', province: 'Alajuela' },
  { id: 'c14', name: 'San Mateo', province: 'Alajuela' },
  { id: 'c15', name: 'Atenas', province: 'Alajuela' },
  { id: 'c16', name: 'Naranjo', province: 'Alajuela' },
  { id: 'c17', name: 'Palmares', province: 'Alajuela' },
  { id: 'c18', name: 'Poás', province: 'Alajuela' },
  
  // Cartago
  { id: 'c19', name: 'Cartago', province: 'Cartago' },
  { id: 'c20', name: 'Paraíso', province: 'Cartago' },
  { id: 'c21', name: 'La Unión', province: 'Cartago' },
  { id: 'c22', name: 'Jiménez', province: 'Cartago' },
  { id: 'c23', name: 'Turrialba', province: 'Cartago' },
  { id: 'c24', name: 'Alvarado', province: 'Cartago' },
  
  // Heredia
  { id: 'c25', name: 'Heredia', province: 'Heredia' },
  { id: 'c26', name: 'Barva', province: 'Heredia' },
  { id: 'c27', name: 'Santo Domingo', province: 'Heredia' },
  { id: 'c28', name: 'Santa Bárbara', province: 'Heredia' },
  { id: 'c29', name: 'San Rafael', province: 'Heredia' },
  { id: 'c30', name: 'San Isidro', province: 'Heredia' },
  { id: 'c31', name: 'Belén', province: 'Heredia' },
  { id: 'c32', name: 'Flores', province: 'Heredia' },
  
  // Guanacaste
  { id: 'c33', name: 'Liberia', province: 'Guanacaste' },
  { id: 'c34', name: 'Nicoya', province: 'Guanacaste' },
  { id: 'c35', name: 'Santa Cruz', province: 'Guanacaste' },
  { id: 'c36', name: 'Bagaces', province: 'Guanacaste' },
  { id: 'c37', name: 'Carrillo', province: 'Guanacaste' },
  { id: 'c38', name: 'Cañas', province: 'Guanacaste' },
  
  // Puntarenas
  { id: 'c39', name: 'Puntarenas', province: 'Puntarenas' },
  { id: 'c40', name: 'Esparza', province: 'Puntarenas' },
  { id: 'c41', name: 'Buenos Aires', province: 'Puntarenas' },
  { id: 'c42', name: 'Montes de Oro', province: 'Puntarenas' },
  { id: 'c43', name: 'Osa', province: 'Puntarenas' },
  { id: 'c44', name: 'Quepos', province: 'Puntarenas' },
  
  // Limón
  { id: 'c45', name: 'Limón', province: 'Limón' },
  { id: 'c46', name: 'Pococí', province: 'Limón' },
  { id: 'c47', name: 'Siquirres', province: 'Limón' },
  { id: 'c48', name: 'Talamanca', province: 'Limón' },
  { id: 'c49', name: 'Matina', province: 'Limón' },
  { id: 'c50', name: 'Guácimo', province: 'Limón' },
];

// Distritos (algunos ejemplos por cantón)
export const mockDistricts: District[] = [
  // San José (Cantón)
  { id: 'd1', name: 'Carmen', canton: 'San José' },
  { id: 'd2', name: 'Merced', canton: 'San José' },
  { id: 'd3', name: 'Hospital', canton: 'San José' },
  { id: 'd4', name: 'Catedral', canton: 'San José' },
  { id: 'd5', name: 'Zapote', canton: 'San José' },
  { id: 'd6', name: 'San Francisco de Dos Ríos', canton: 'San José' },
  { id: 'd7', name: 'Uruca', canton: 'San José' },
  { id: 'd8', name: 'Mata Redonda', canton: 'San José' },
  { id: 'd9', name: 'Pavas', canton: 'San José' },
  { id: 'd10', name: 'Hatillo', canton: 'San José' },
  { id: 'd11', name: 'San Sebastián', canton: 'San José' },
  
  // Escazú
  { id: 'd12', name: 'Escazú', canton: 'Escazú' },
  { id: 'd13', name: 'San Antonio', canton: 'Escazú' },
  { id: 'd14', name: 'San Rafael', canton: 'Escazú' },
  
  // Desamparados
  { id: 'd15', name: 'Desamparados', canton: 'Desamparados' },
  { id: 'd16', name: 'San Miguel', canton: 'Desamparados' },
  { id: 'd17', name: 'San Juan de Dios', canton: 'Desamparados' },
  { id: 'd18', name: 'San Rafael Arriba', canton: 'Desamparados' },
  { id: 'd19', name: 'San Antonio', canton: 'Desamparados' },
  { id: 'd20', name: 'Frailes', canton: 'Desamparados' },
  { id: 'd21', name: 'Patarrá', canton: 'Desamparados' },
  { id: 'd22', name: 'San Cristóbal', canton: 'Desamparados' },
  
  // Goicoechea
  { id: 'd23', name: 'Guadalupe', canton: 'Goicoechea' },
  { id: 'd24', name: 'San Francisco', canton: 'Goicoechea' },
  { id: 'd25', name: 'Calle Blancos', canton: 'Goicoechea' },
  { id: 'd26', name: 'Mata de Plátano', canton: 'Goicoechea' },
  { id: 'd27', name: 'Ipís', canton: 'Goicoechea' },
  { id: 'd28', name: 'Rancho Redondo', canton: 'Goicoechea' },
  { id: 'd29', name: 'Purral', canton: 'Goicoechea' },
  
  // Santa Ana
  { id: 'd30', name: 'Santa Ana', canton: 'Santa Ana' },
  { id: 'd31', name: 'Salitral', canton: 'Santa Ana' },
  { id: 'd32', name: 'Pozos', canton: 'Santa Ana' },
  { id: 'd33', name: 'Uruca', canton: 'Santa Ana' },
  { id: 'd34', name: 'Piedades', canton: 'Santa Ana' },
  { id: 'd35', name: 'Brasil', canton: 'Santa Ana' },
  
  // Alajuela (Cantón)
  { id: 'd36', name: 'Alajuela', canton: 'Alajuela' },
  { id: 'd37', name: 'San José', canton: 'Alajuela' },
  { id: 'd38', name: 'Carrizal', canton: 'Alajuela' },
  { id: 'd39', name: 'San Antonio', canton: 'Alajuela' },
  { id: 'd40', name: 'Guácima', canton: 'Alajuela' },
  { id: 'd41', name: 'San Isidro', canton: 'Alajuela' },
  { id: 'd42', name: 'Sabanilla', canton: 'Alajuela' },
  { id: 'd43', name: 'San Rafael', canton: 'Alajuela' },
  
  // Heredia (Cantón)
  { id: 'd44', name: 'Heredia', canton: 'Heredia' },
  { id: 'd45', name: 'Mercedes', canton: 'Heredia' },
  { id: 'd46', name: 'San Francisco', canton: 'Heredia' },
  { id: 'd47', name: 'Ulloa', canton: 'Heredia' },
  { id: 'd48', name: 'Varablanca', canton: 'Heredia' },
  
  // Santo Domingo
  { id: 'd49', name: 'Santo Domingo', canton: 'Santo Domingo' },
  { id: 'd50', name: 'San Vicente', canton: 'Santo Domingo' },
  { id: 'd51', name: 'San Miguel', canton: 'Santo Domingo' },
  { id: 'd52', name: 'Paracito', canton: 'Santo Domingo' },
  
  // Cartago (Cantón)
  { id: 'd53', name: 'Oriental', canton: 'Cartago' },
  { id: 'd54', name: 'Occidental', canton: 'Cartago' },
  { id: 'd55', name: 'Carmen', canton: 'Cartago' },
  { id: 'd56', name: 'San Nicolás', canton: 'Cartago' },
  { id: 'd57', name: 'Aguacaliente', canton: 'Cartago' },
  { id: 'd58', name: 'Guadalupe', canton: 'Cartago' },
  
  // Liberia
  { id: 'd59', name: 'Liberia', canton: 'Liberia' },
  { id: 'd60', name: 'Cañas Dulces', canton: 'Liberia' },
  { id: 'd61', name: 'Mayorga', canton: 'Liberia' },
  { id: 'd62', name: 'Nacascolo', canton: 'Liberia' },
  { id: 'd63', name: 'Curubandé', canton: 'Liberia' },
  
  // Limón (Cantón)
  { id: 'd64', name: 'Limón', canton: 'Limón' },
  { id: 'd65', name: 'Valle La Estrella', canton: 'Limón' },
  { id: 'd66', name: 'Río Blanco', canton: 'Limón' },
  { id: 'd67', name: 'Matama', canton: 'Limón' },
  
  // Puntarenas (Cantón)
  { id: 'd68', name: 'Puntarenas', canton: 'Puntarenas' },
  { id: 'd69', name: 'Pitahaya', canton: 'Puntarenas' },
  { id: 'd70', name: 'Chomes', canton: 'Puntarenas' },
  { id: 'd71', name: 'Lepanto', canton: 'Puntarenas' },
  { id: 'd72', name: 'Paquera', canton: 'Puntarenas' },
];
